import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex rounded-lg p-4 shadow-card border border-neutral-200 hover:bg-neutral-100 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}
