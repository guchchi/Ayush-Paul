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
      className="group relative overflow-hidden bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-500 rounded-full px-6 py-2.5 h-auto"
    >
      <i className="absolute inset-0 z-10 grid w-[34px] place-items-center bg-white/10 transition-all duration-700 group-hover:w-full rounded-full">
        <ArrowLeft
          className="opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
          size={18}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </i>
      <span className="ml-8 translate-x-0.5 transition-all duration-700 group-hover:opacity-0 group-hover:translate-x-4 text-[13px] font-bold tracking-widest uppercase">
        {label}
      </span>
    </Button>
  );
}
