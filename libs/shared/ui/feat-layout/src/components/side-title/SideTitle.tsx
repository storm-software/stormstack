"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";

export function SideTitle({ className, ...props }: BaseComponentProps) {
  return (
    <div className="flex -rotate-90 flex-col">
      <Link>
        <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_40%] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_6px]">
          <h1 className="font-app-title-1 text-primary text-6xl leading-none shadow-white drop-shadow-2xl">
            Patrick Sullivan
          </h1>
        </span>
        <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_40%] bg-bottom bg-no-repeat transition-[background-size] hover:bg-[length:100%_6px]">
          <h1 className="font-app-title-1 text-primary text-6xl leading-none shadow-white drop-shadow-2xl">
            Development
          </h1>
        </span>
      </Link>
    </div>
  );
}
