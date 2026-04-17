"use client"

import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react"
import { Check, Loader2, SendHorizontal, X } from "lucide-react"

import { cn } from "@/src/lib/utils"
import { Button, ButtonProps } from "@/src/components/ui/button"

const DRAG_CONSTRAINTS = { left: 0, right: 155 }
const DRAG_THRESHOLD = 0.9

const ANIMATION_CONFIG = {
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
}

type StatusIconProps = {
  status: "idle" | "loading" | "success" | "error"
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<StatusIconProps["status"], JSX.Element | null> = useMemo(
    () => ({
      idle: null,
      loading: <Loader2 className="animate-spin" size={20} />,
      success: <Check size={20} />,
      error: <X size={20} />,
    }),
    []
  )

  if (!iconMap[status]) return null

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2"
    >
      {iconMap[status]}
      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
        {status === 'loading' ? 'Transmitting...' : status === 'success' ? 'Transmission successful' : 'Error'}
      </span>
    </motion.div>
  )
}

interface SlideButtonProps extends Omit<ButtonProps, 'status'> {
  status: "idle" | "loading" | "success" | "error";
  onSlideComplete: () => void;
}

const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ className, status, onSlideComplete, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [completed, setCompleted] = useState(false)
    const dragHandleRef = useRef<HTMLDivElement | null>(null)

    const dragX = useMotionValue(0)
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
    const dragProgress = useTransform(
      springX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    )

    const handleDragStart = useCallback(() => {
      if (completed || status === "loading") return
      setIsDragging(true)
    }, [completed, status])

    const handleDragEnd = () => {
      if (completed || status === "loading") return
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true)
        onSlideComplete()
      } else {
        dragX.set(0)
      }
    }

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (completed || status === "loading") return
      const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right))
      dragX.set(newX)
    }

    // Reset if status goes back to idle or success is reset
    React.useEffect(() => {
      if (status === "idle") {
        setCompleted(false);
        dragX.set(0);
      }
    }, [status, dragX]);

    const adjustedWidth = useTransform(springX, (x) => x + 40)

    return (
      <div
        className={cn(
          "shadow-button-inset dark:shadow-button-inset-dark relative flex h-14 w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden",
          className
        )}
      >
        <AnimatePresence>
          {!completed && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">Slide to Initiate Contact</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!completed && (
          <motion.div
            style={{
              width: adjustedWidth,
            }}
            className="absolute inset-y-0 left-0 z-0 bg-brand-primary/10 backdrop-blur-sm"
          />
        )}
        
        <AnimatePresence>
          {!completed && (
            <motion.div
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: springX }}
              className="absolute left-2 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
            >
              <Button
                ref={ref}
                disabled={status === "loading"}
                variant="premium"
                size="icon"
                {...props}
                className={cn(
                  "h-10 w-10 shadow-button rounded-xl drop-shadow-xl",
                  isDragging && "scale-105 transition-transform",
                )}
              >
                <SendHorizontal size={20} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {completed && (
            <motion.div
              key="status"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-3 text-white font-bold">
                <StatusIcon status={status} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

SlideButton.displayName = "SlideButton"

export { SlideButton }
