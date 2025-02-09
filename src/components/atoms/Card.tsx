import { ReactNode } from "react";
import Container from "./Container";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Container.FlexRow
      className={`rounded-lg p-4 shadow-card border border-neutral-200 hover:bg-neutral-100 cursor-pointer ${className}`}
    >
      {children}
    </Container.FlexRow>
  );
}
