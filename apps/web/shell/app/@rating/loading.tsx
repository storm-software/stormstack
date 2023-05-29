import { LogoLoading } from "@open-system/shared-ui-feature-layout/logo-loading";

export function Loading() {
  return (
    <div className="fixed right-0 top-3/4 z-like pr-10">
        <LogoLoading className="m-auto h-20 w-24" />
    </div>
  );
}
