import Logo from "../../../../../../assets/box-logo-black.svg";

export function PageLoading() {
  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center gap-10 overflow-hidden">
      <div className="z-20 rounded-full bg-primary py-20 px-24">
        <div className="h-[22rem] w-[18rem]">
          <Logo className="h-[22rem] w-[18rem]" />
        </div>
      </div>

      <div className="flex animate-pulse flex-row items-end gap-5">
        <h1 className="text-8xl font-label-2 leading-10 text-quaternary">
          Loading
        </h1>
        <div className="h-4 w-4 rounded-full bg-quaternary" />
        <div className="h-4 w-4 rounded-full bg-quaternary" />
        <div className="h-4 w-4 rounded-full bg-quaternary" />
      </div>

      <div className="fixed right-0 top-[6rem] left-0 z-10 overflow-hidden">
        <div className="ml-12 w-full animate-marquee whitespace-nowrap py-12">
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
        </div>
        <div className="absolute top-0 left-0 right-0 animate-marquee2 whitespace-nowrap px-64 py-12">
          <span className="mx-4 ml-12 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
        </div>
      </div>

      <div className="fixed top-[12rem] left-0 right-0 z-10 overflow-hidden">
        <div className="ml-36 w-full animate-marquee whitespace-nowrap py-12">
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
        </div>
        <div className="absolute top-0 left-0 right-0 animate-marquee2 whitespace-nowrap px-64 py-12">
          <span className="mx-4 ml-36 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
        </div>
      </div>

      <div className="fixed top-[20rem] left-0 right-0 z-30 overflow-hidden">
        <div className="w-full animate-marquee whitespace-nowrap py-12">
          <span className="mx-4 font-app-title-1 text-8xl text-secondary">
            Patrick Sullivan Development
          </span>
          <span className="mx-4 font-app-title-1 text-8xl text-secondary">
            Patrick Sullivan Development
          </span>
        </div>
      </div>

      <div className="fixed right-0 top-[26rem] left-0 z-10 overflow-hidden">
        <div className="ml-12 w-full animate-marquee whitespace-nowrap py-12">
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
        </div>
        <div className="absolute top-0 left-0 right-0 animate-marquee2 whitespace-nowrap px-64 py-12">
          <span className="mx-4 ml-12 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
          <span className="mx-4 font-app-title-1 text-6xl text-primary">
            Patrick Sullivan Development
          </span>
        </div>
      </div>
    </div>
  );
}
