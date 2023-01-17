import { default as Logo } from "../../../../../../assets/box-logo-gradient.svg";
import BackgroundPattern from "./background-pattern";

export default function Header() {
  return (
    <header className="relative flex snap-center snap-always justify-center bg-bg-title bg-[length:100%_50%] bg-fixed bg-no-repeat bg-origin-border py-20 pt-[5.5rem]">
      <div className="relative h-[36rem] w-[60rem]">
        <div className="absolute bottom-0 left-0 z-30">
          <div className="flex flex-col gap-5">
            <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
              <h1 className="font-app-title-1 text-8xl leading-[4.5rem] text-primary shadow-white text-shadow-lg">
                Pat Sullivan
              </h1>
            </span>
            <span className="w-fit bg-gradient-to-r from-gradient-to via-gradient-via to-gradient-from bg-[length:100%_40%] bg-bottom bg-no-repeat px-2 transition-[background-size] hover:bg-[length:100%_6px]">
              <h1 className="font-app-title-1 text-8xl leading-[4.5rem] text-primary shadow-white text-shadow-lg">
                Development
              </h1>
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 z-30">
          <Logo alt="box-logo" height={400} />
        </div>
      </div>

      <div className="absolute left-0 top-8">
        {/*<BackgroundSpiral width={475} strokeWidth={10} /> <HeaderLinks />*/}
      </div>
      <div className="absolute -bottom-2 left-0">
        <BackgroundPattern />
      </div>
      <div className="absolute -bottom-2 right-0">
        <BackgroundPattern isInverse={true} />
      </div>
    </header>
  );
}
