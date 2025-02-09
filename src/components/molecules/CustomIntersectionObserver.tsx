import { forwardRef, useEffect, useRef, ComponentProps } from "react";

type ObserverTargetProps = Omit<ComponentProps<"div">, "ref">;

export const ObserverTarget = forwardRef<HTMLDivElement, ObserverTargetProps>(
  ({ children = null, className = "", ...others }, ref) => (
    <div
      ref={ref}
      className={`flex w-full h-12 items-center justify-center shrink-0 text-white ${className}`}
      {...others}
    >
      {children}
    </div>
  )
);

type CustomIntersectionObserverProps = ObserverTargetProps & {
  callback: () => void;
};

export default function CustomIntersectionObserver({
  callback,
  children,
  ...others
}: CustomIntersectionObserverProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) callback();
        });
      },
      {
        root: null,
        rootMargin: "10px",
        threshold: 0,
      }
    );

    if (targetRef.current) observer.observe(targetRef.current);

    const copyObserverTargetElement = targetRef;

    return () => {
      if (copyObserverTargetElement.current) {
        observer.unobserve(copyObserverTargetElement.current);
      }
    };
  }, [callback]);

  return (
    <ObserverTarget ref={targetRef} {...others}>
      {children}
    </ObserverTarget>
  );
}
