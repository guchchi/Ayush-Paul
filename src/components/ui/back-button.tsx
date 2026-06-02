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
      variant="secondary"
      size="sm"
      onClick={handleClick}
      className="group relative overflow-hidden pl-3 pr-5"
    >
      <i className="absolute inset-0 z-10 grid w-8 place-items-center transition-all duration-500 group-hover:w-full rounded-full bg-white/10">
        <ArrowLeft
          className="opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
          size={15}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </i>
      <span className="ml-7 translate-x-0.5 transition-all duration-500 group-hover:opacity-0 group-hover:translate-x-3">
        {label}
      </span>
    </Button>
  );
}
