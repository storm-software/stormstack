import { LogoLoading } from "@open-system/shared-components";

export default function Loading() {
  return (
    <div className="z-like fixed right-0 top-3/4 pr-10">
      <LogoLoading className="m-auto h-20 w-24" />
    </div>
  );
}
