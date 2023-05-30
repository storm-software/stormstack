import { LogoLoading } from "@open-system/shared-ui-feature-layout/logo-loading";

export default function Loading() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-highest h-[100%] w-screen overflow-hidden bg-bg-1">
      <div className="relative h-full w-full p-20">
        <LogoLoading className="m-auto h-[34rem] w-[42rem]" />
      </div>
    </div>
  );
}
