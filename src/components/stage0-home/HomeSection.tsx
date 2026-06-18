import React, { type ReactNode } from "react";

interface HomeSectionProps {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  variant?: "white" | "surface";
  className?: string;
}

export function HomeSection({
  eyebrow,
  title,
  children,
  variant = "white",
  className = "",
}: HomeSectionProps) {
  const bgClass = variant === "surface" ? "bg-surface" : "bg-white";

  return (
    <section className={`${bgClass} py-16 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && <p className="dq-overline">{eyebrow}</p>}
            {title && (
              <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-dq-navy sm:text-[36px]">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
