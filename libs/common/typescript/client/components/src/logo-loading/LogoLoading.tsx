import { BaseComponentProps } from "@stormstack/design-system-components";
import clsx from "clsx";
import LogoTextPrimary from "../../assets/logo-text-primary.svg";

export function LogoLoading({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx({ "h-full w-full": !className }, className)}>
      <div className="h-full w-full relative">
        <div className="z-10 h-full w-full px-2 absolute">
          <div className="mx-auto h-full border-primary w-[90%] border-[30px] p-[5%]">
            <div className="h-full w-full relative overflow-hidden">
              <div className="h-full w-full origin-right bg-primary absolute animate-loading"></div>
            </div>
          </div>
        </div>
        <div className="z-20 h-full w-full absolute">
          <div className="h-full w-full flex items-center">
            <div className="h-fit w-full">
              <LogoTextPrimary
                alt="PS Development"
                className="mx-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
