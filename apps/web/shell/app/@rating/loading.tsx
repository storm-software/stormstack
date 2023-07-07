import { Spinner } from "@open-system/design-system-components";

export default function Loading() {
  return (
    <div className="z-like fixed right-0 top-3/4 pr-10">
      <Spinner className="m-auto h-20 w-24" />
    </div>
  );
}
