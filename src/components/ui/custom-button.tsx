
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CircleNotch } from "lucide-react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animation?: "none" | "pulse" | "float";
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    animation = "none",
    children, 
    ...props 
  }, ref) => {
    // Create the animation class based on the animation prop
    const animationClass = 
      animation === "pulse" ? "animate-pulse-subtle" : 
      animation === "float" ? "animate-float" : "";
    
    return (
      <Button
        ref={ref}
        variant={variant === "primary" ? "default" : variant}
        size={size}
        className={cn(
          // Base styles
          "relative overflow-hidden transition-all duration-200",
          // Animation
          animationClass,
          // Variant specific styles for primary
          variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
          // Size specific adjustments
          size === "lg" && "text-base px-8 py-3",
          // The rest of the classnames
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <CircleNotch className="h-5 w-5 animate-spin" />
          </span>
        )}
        <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton };
