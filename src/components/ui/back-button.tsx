import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/button";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to, label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="group relative overflow-hidden bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 rounded-full px-5 py-2 h-auto"
    >
      <i className="absolute inset-0 z-10 grid w-1/4 place-items-center bg-white/10 transition-all duration-500 group-hover:w-full rounded-full">
        <ArrowLeft
          className="opacity-60 group-hover:opacity-100 transition-opacity"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </i>
      <span className="ml-7 translate-x-1 transition-all duration-500 group-hover:opacity-0 group-hover:translate-x-2 text-sm font-semibold tracking-wide">
        {label}
      </span>
    </Button>
  );
}
