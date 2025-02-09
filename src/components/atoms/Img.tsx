import { ComponentProps } from "react";

type ImgProps = ComponentProps<"img"> & {
  className?: string;
};

export default function Img({ src, className }: ImgProps) {
  return <img className={`size-full object-cover ${className}`} src={src} />;
}
