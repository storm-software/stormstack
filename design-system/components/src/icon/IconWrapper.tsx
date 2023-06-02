import { Suspense } from "react";
import { Icon, IconProps } from "./Icon";

export default function IconWrapper(props: IconProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Icon {...props} />
    </Suspense>
  );
}
