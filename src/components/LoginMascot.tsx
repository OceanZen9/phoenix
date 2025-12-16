
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LoginMascotProps {
  focusedField: string | null;
  className?: string;
  size?: number;
}

export function LoginMascot({ focusedField, className, size = 120 }: LoginMascotProps) {
  const faceRef = useRef<SVGSVGElement>(null);
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // If password is focused, do not update pupil position based on mouse.
      // But we might want to ensure they stay 'down' or 'centered'. 
      // This is handled by a separate effect or just logic here.
      if (focusedField === "password") return;
      
      if (!faceRef.current || !leftPupilRef.current || !rightPupilRef.current) return;

      const rect = faceRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawX = e.clientX - centerX;
      const rawY = e.clientY - centerY;

      // Limit the movement range
      const maxDist = 10;
      const angle = Math.atan2(rawY, rawX);
      const dist = Math.min(Math.sqrt(rawX * rawX + rawY * rawY) / 10, maxDist);

      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      leftPupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
      rightPupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [focusedField]); // Re-bind if focusedField changes

  // Separate effect to handle "password" state reset
  useEffect(() => {
    if (focusedField === "password") {
       if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(0px, 5px)`;
       if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(0px, 5px)`;
    }
  }, [focusedField]);

  const isPasswordFocused = focusedField === "password";

  return (
    <div className={cn("flex justify-center mb-4", className)}>
      <svg
        ref={faceRef}
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Head */}
        <circle cx="60" cy="60" r="50" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />

        {/* Ears (Simple Triangles) */}
        <path d="M 25 35 L 15 15 L 40 25 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 95 35 L 105 15 L 80 25 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="3" strokeLinejoin="round" />

        {/* Eyes Group */}
        <g className="eyes">
          {/* Left Eye */}
          <circle cx="40" cy="55" r="12" fill="white" stroke="#334155" strokeWidth="2" />
          <circle
            ref={leftPupilRef}
            cx="40"
            cy="55"
            r="5"
            fill="#0f172a"
            style={{
              transition: "transform 0.1s ease-out", 
            }}
          />

          {/* Right Eye */}
          <circle cx="80" cy="55" r="12" fill="white" stroke="#334155" strokeWidth="2" />
          <circle
            ref={rightPupilRef}
            cx="80"
            cy="55"
            r="5"
            fill="#0f172a"
            style={{
              transition: "transform 0.1s ease-out",
            }}
          />
        </g>

        {/* Beak */}
        <path d="M 55 70 L 65 70 L 60 80 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />

        {/* Hands/Paws (for covering eyes) - Default position: hidden/lowered */}
        <g
            className="hands"
            style={{
                transformOrigin: "60px 100px",
                transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                transform: isPasswordFocused ? "translateY(0) rotate(0)" : "translateY(20px) rotate(160deg) scale(0)",
                opacity: isPasswordFocused ? 1 : 0
            }}
        >   
           {/* Left Hand covering left eye */}
            <path
                d="M 30 90 C 10 90, 10 40, 40 45 C 50 50, 50 90, 30 90 Z"
                fill="#cbd5e1"
                stroke="#64748b"
                strokeWidth="2"
                transform="rotate(-15, 30, 90)" 
            />
             {/* Right Hand covering right eye */}
            <path
                d="M 90 90 C 110 90, 110 40, 80 45 C 70 50, 70 90, 90 90 Z"
                fill="#cbd5e1"
                stroke="#64748b"
                strokeWidth="2"
                 transform="rotate(15, 90, 90)" 
            />
        </g>
        
        {/* Simple visual fallback for hands when NOT focused (just resting at bottom) */}
         <g style={{ opacity: isPasswordFocused ? 0 : 1, transition: "opacity 0.2s" }}>
             <path d="M 20 100 Q 30 85 40 100" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
             <path d="M 80 100 Q 90 85 100 100" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
         </g>

      </svg>
    </div>
  );
}
