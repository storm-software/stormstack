import { Link } from "@stormstack/core-client-components";
import {
  BaseComponentProps,
  Divider
} from "@stormstack/design-system-components";
import { ReactElement } from "react";
import { Barcode } from "../barcode";
import { BoxLogo } from "../box-logo";

export type FooterProps = BaseComponentProps & {
  top?: ReactElement<BaseComponentProps>;
  bottom?: ReactElement<BaseComponentProps>;
};

export function Footer({ className, top, bottom, ...props }: FooterProps) {
  return (
    <footer className="mt-36 w-full bg-cover relative z-footer bg-bg-footer bg-no-repeat">
      <div className="h-full w-full border-t border-t-slate-400 backdrop-blur-3xl backdrop-brightness-50 flex flex-col">
        <div className="w-full flex-1 gap-6 px-8 pb-3 pt-16 sm:px-10 md:px-12 lg:px-16 flex flex-col">
          {top}

          {top && bottom && <Divider size="md" variant="light" />}

          {bottom}
        </div>
        <div className="my-4 lg:hidden flex flex-row items-center justify-center">
          <Link className="h-[32rem] w-[38rem]">
            <BoxLogo className="h-[32rem] w-[38rem]" />
          </Link>
        </div>
        <div className="w-full pb-3 pt-2 flex flex-row justify-center">
          <div className="grid-cols-1 gap-1 grid justify-items-center">
            <Barcode />
            <p className="text-sm text-gray-400 font-footer-copyright">
              Copyright © 2023. Pat Sullivan Development. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
