import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import { default as BackgroundImg } from "../../../../../../assets/backgrounds/bg-header.svg";

export interface BackgroundPatternProps extends BaseComponentProps {
  isInverse?: boolean;
}

export default function BackgroundPattern({
  isInverse = false,
}: BackgroundPatternProps) {
  /*const { scrollYProgress } = useScroll();
  const rotateX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 100],
    isInverse ? [0, -180] : [0, 180]
  );
  const rotateX = useSpring(transform, {
    stiffness: 1000,
    damping: 10,
    velocity: 50,
  });*/

  return (
    <BackgroundImg
      height={455}
      className={clsx(
        { "flip-y -rotate-1": isInverse },
        { "rotate-1": !isInverse },
        "z-bg stroke-purple-900"
      )}
    />
  );
}
