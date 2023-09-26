"use client";

import { LogoLoading } from "@stormstack/common-client-components";

export default function Loading() {
  return (
    <div className="bottom-0 left-0 right-0 top-0 w-screen bg-bg-1 fixed z-highest h-[100%] overflow-hidden">
      <div className="h-full w-full p-20 relative">
        <LogoLoading className="m-auto h-[34rem] w-[42rem]" />
      </div>
    </div>
  );
}
