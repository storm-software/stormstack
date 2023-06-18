import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { VariantTypes } from "../types";

export interface BackgroundSphereProps extends BaseComponentProps {
  variant?: string | VariantTypes;
}

/**
 * The base Background Sphere component used by the Open System repository
 */
export function BackgroundSphere({
  className,
  containerRef,
  variant = VariantTypes.PRIMARY,
}: BackgroundSphereProps) {
  return (
    <div
      className={clsx(
        {
          "border-primary from-primary/70 to-primary/50 shadow-primary/50":
            variant === VariantTypes.PRIMARY,
        },
        {
          "border-secondary from-secondary/70 to-secondary/50 shadow-secondary/50":
            variant === VariantTypes.SECONDARY,
        },
        {
          "border-tertiary from-tertiary/70 to-tertiary/50 shadow-tertiary/50":
            variant === VariantTypes.TERTIARY,
        },
        {
          "border-quaternary from-quaternary/70 to-quaternary/50 shadow-quaternary/50":
            variant === VariantTypes.QUARTERNARY,
        },
        "z-bg-sphere rounded-full border-[6px] bg-gradient-to-r shadow-[0_0_25px_10px_rgba(0,0,0,0.01)]",
        className
      )}
    />
  );
}
