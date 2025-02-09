import { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div">;

export default function Container({
  children,
  className = "",
  ...others
}: ContainerProps) {
  return (
    <div className={className} {...others}>
      {children}
    </div>
  );
}

const FlexRowContainer = ({
  children,
  className = "",
  ...others
}: ContainerProps) => (
  <div className={`flex ${className}`} {...others}>
    {children}
  </div>
);

const FlexColumnContainer = ({
  children,
  className = "",
  ...others
}: ContainerProps) => (
  <div
    className={`flex flex-col ${className}`}
    {...others}
  >
    {children}
  </div>
);

Container.FlexRow = FlexRowContainer;
Container.FlexCol = FlexColumnContainer;
