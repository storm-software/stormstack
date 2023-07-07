import { Link } from "@open-system/core-client-components";
import {
  BaseComponentProps,
  Divider,
} from "@open-system/design-system-components";
import { ReactElement } from "react";
import { Barcode } from "../barcode";
import { BoxLogo } from "../box-logo";

export type FooterProps = BaseComponentProps & {
  top?: ReactElement<BaseComponentProps>;
  bottom?: ReactElement<BaseComponentProps>;
};

export function Footer({ className, top, bottom, ...props }: FooterProps) {
  return (
    <footer className="relative z-footer mt-36 w-full bg-bg-footer bg-cover bg-no-repeat">
      <div className="flex h-full w-full flex-col border-t border-t-slate-400 backdrop-blur-3xl backdrop-brightness-50">
        <div className="flex w-full flex-1 flex-col gap-6 px-8 pb-3 pt-16 sm:px-10 md:px-12 lg:px-16">
          {top}

          {top && bottom && <Divider size="md" variant="light" />}

          {bottom}
        </div>
        <div className="my-4 flex flex-row items-center justify-center lg:hidden">
          <Link className="h-[32rem] w-[38rem]">
            <BoxLogo className="h-[32rem] w-[38rem]" />
          </Link>
        </div>
        <div className="flex w-full flex-row justify-center pb-3 pt-2">
          <div className="grid grid-cols-1 justify-items-center gap-1">
            <Barcode />
            <p className="font-footer-copyright text-sm text-gray-400">
              Copyright © 2023. Pat Sullivan Development. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
