import { BaseComponentProps } from "@open-system/design-system-components";
import clsx from "clsx";
import LogoTextPrimary from "../../assets/logo-text-primary.svg";

export function LogoLoading({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx({"h-full w-full": !className }, className)}>
      <div className="relative h-full w-full">
        <div className="absolute z-10 h-full w-full">
          <div className="mx-auto h-full w-[90%] border-[30px] border-primary p-[5%]">
            <div className="relative h-full w-full overflow-hidden">
            <div className="h-full w-full bg-primary animate-loading origin-right absolute"></div>
            </div>
          </div>
        </div>
        <div className="absolute z-20 h-full w-full">
          <div className="flex h-full w-full items-center">
            <div className="h-fit w-full">
              <LogoTextPrimary alt="PS Development" className="mx-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
