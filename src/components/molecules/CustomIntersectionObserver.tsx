import {
  forwardRef,
  useEffect,
  useRef,
  ComponentProps,
  useCallback,
} from "react";

type ObserverTargetProps = Omit<ComponentProps<"div">, "ref">;

export const ObserverTarget = forwardRef<HTMLDivElement, ObserverTargetProps>(
  ({ children = null, className = "", ...others }, ref) => (
    <div
      ref={ref}
      className={`flex w-full h-8 items-center justify-center shrink-0 text-white ${className}`}
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
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const el = entry.target;
          console.log("el", el);
          if (entry.isIntersecting) memoizedCallback();
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      }
    );

    if (targetRef.current) observer.observe(targetRef.current);

    const copyObserverTargetElement = targetRef;

    return () => {
      if (copyObserverTargetElement.current) {
        observer.unobserve(copyObserverTargetElement.current);
      }
    };
  }, [memoizedCallback]);

  return (
    <ObserverTarget ref={targetRef} {...others}>
      {children}
    </ObserverTarget>
  );
}
