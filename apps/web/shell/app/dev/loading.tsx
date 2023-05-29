import { LogoLoading } from "@open-system/shared-ui-feature-layout/logo-loading";

export default function Loading() {
  return (
    <div className="z-highest h-full w-full bg-bg-1">
      <div className="relative h-full w-full p-20">
        <LogoLoading className="m-auto h-[30rem] w-[36rem]" />
      </div>
    </div>
  );
}
