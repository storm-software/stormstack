import { Spinner } from "@stormstack/design-system-components";

export default function Loading() {
  return (
    <div className="z-like right-0 top-3/4 pr-10 fixed">
      <Spinner className="m-auto h-20 w-24" />
    </div>
  );
}
