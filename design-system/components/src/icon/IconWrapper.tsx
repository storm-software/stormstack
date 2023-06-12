import { Suspense } from "react";
import { Icon, IconProps } from "./Icon";
import { Spinner } from "../spinner";

export default function IconWrapper(props: IconProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center">
          <Spinner className="m-auto h-2/3 w-2/3" />
        </div>
      }>
      <Icon {...props} />
    </Suspense>
  );
}
