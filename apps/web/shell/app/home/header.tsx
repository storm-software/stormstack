"use client";

import Logo from "../../../../../assets/box-logo-gradient.svg";

export default function Header() {
  return (
    <header className="bg-bg-title flex snap-center snap-always justify-center bg-[length:100%_50%] bg-fixed bg-no-repeat bg-origin-border py-20">
      <div className="relative h-[38rem] max-w-[65rem] md:w-3/4 lg:w-2/3">
        <div className="absolute bottom-0 left-0">
          <div className="flex flex-col gap-3">
            <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
              <h1 className="text-shadow-lg font-app-title-1 text-primary text-8xl leading-[4.5rem] shadow-white">
                Patrick
              </h1>
            </span>

            <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
              <h1 className="text-shadow-lg font-app-title-1 text-primary text-8xl leading-[4.5rem] shadow-white">
                Sullivan
              </h1>
            </span>

            <span className="from-gradient-to via-gradient-via to-gradient-from w-fit bg-gradient-to-r bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
              <h1 className="text-shadow-lg font-app-title-1 text-primary text-8xl leading-[4.5rem] shadow-white">
                Development
              </h1>
            </span>
          </div>
        </div>

        <div className="absolute top-0 right-0">
          <Logo alt="box-logo" />
        </div>
      </div>
    </header>
  );
}