import { SideTitle } from "@stormstack/common-client-components";
import {
  Link,
  ScrollArrowIndicator,
  ScrollProgressBar
} from "@stormstack/core-client-components";
import { Card } from "@stormstack/design-system-components";
import AppTitle from "../components/app-title";
import HeaderBottom from "../components/header-bottom";
import SubscriptionCard from "../components/subscription-card";
import VhsTitleBar from "../components/vhs-title-bar";
import Client from "./client";

export default function Page() {
  return (
    <div className="h-full w-full relative">
      <div className="z-progress">
        <ScrollProgressBar />
      </div>

      <div className="z-scroll">
        <ScrollArrowIndicator />
      </div>

      <header className="h-fit lg:min-h-[200vh] relative flex min-h-[220vh] flex-col overflow-hidden">
        <div className="min-h-screen w-full relative h-[150vh]">
          <div className="top-0 z-10 h-full w-full pb-10 absolute overflow-hidden bg-fixed">
            <div className="h-full w-full relative">
              <div className="left-10 top-10 z-30 h-48 w-64 border-l-gray-500/30 border-t-gray-500/30 absolute border-l-[10px] border-t-[10px]">
                <div className="m-5 gap-3 relative flex flex-row items-center">
                  <div className="vhs-text h-8 w-8 rounded-full bg-red-800/40 animate-flash" />
                  <p className="vhs-text text-6xl font-black text-red-800/40">
                    REC
                  </p>
                </div>
              </div>
              <div className="right-10 top-10 z-30 h-48 w-64 border-r-gray-500/30 border-t-gray-500/30 absolute border-r-[10px] border-t-[10px]">
                <div className="w-full pr-10 relative flex flex-row-reverse items-start">
                  <svg
                    className="vhs-text h-20 origin-center -rotate-90 fill-gray-500/30"
                    viewBox="0 0 471.829 471.829">
                    <g>
                      <path
                        d="M319.089,27.221h-36.475V0h-95.27v27.221h-34.607c-22.517,0-40.829,18.317-40.829,40.832v362.946
		c0,22.51,18.317,40.83,40.829,40.83h166.352c22.524,0,40.832-18.32,40.832-40.83V68.052
		C359.921,45.538,341.613,27.221,319.089,27.221z M332.705,431.002c0,7.501-6.108,13.607-13.616,13.607H152.737
		c-7.501,0-13.608-6.095-13.608-13.607V68.052c0-7.501,6.107-13.611,13.608-13.611h166.352c7.508,0,13.616,6.109,13.616,13.611
		V431.002z M317.862,428.5H153.966v-59.719h163.896V428.5z M317.862,354.071H153.966v-59.716h163.896V354.071z M317.862,279.64
		H153.966v-59.72h163.896V279.64z"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              <div className="left-10 z-30 h-48 w-64 border-b-gray-500/30 border-l-gray-500/30 absolute bottom-[50vh] border-b-[10px] border-l-[10px]" />
              <div className="right-10 z-30 h-48 w-64 border-b-gray-500/30 border-r-gray-500/30 absolute bottom-[50vh] border-b-[10px] border-r-[10px]" />

              <div className="left-64 right-64 z-30 absolute bottom-[47vh] flex flex-row items-center">
                <VhsTitleBar />
              </div>

              <div className="line">
                <div className="red" />
                <div className="white" />
                <div className="green" />
              </div>

              <div className="left-0 top-0 z-20 h-full w-full after:bottom-0 after:left-0 after:right-0 after:top-0 absolute overflow-hidden after:absolute after:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)] after:content-['']">
                <div className="tv-static -bottom-52 -left-52 -right-52 -top-52 absolute animate-tv-static opacity-[35%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="left-0 top-20 h-fit w-full absolute z-title">
          <div className="h-fit w-full relative">
            <AppTitle />
          </div>
        </div>

        <HeaderBottom>
          <div className="background-gradient w-full flex-1 px-4 pb-32 flex flex-col items-center justify-center">
            <div className="grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 grid justify-between">
              <SubscriptionCard />
              <Card
                className="h-full cursor-pointer min-h-[8rem]"
                title="Resume"
                details="Download a copy of my resume"
                iconType="download"
              />
              <Card
                className="h-full cursor-pointer min-h-[8rem]"
                title="Articles"
                details="Read some recent articles I've written"
                iconType="pencil"
              />
              <Link href="/contact">
                <Card
                  className="h-full cursor-pointer min-h-[8rem]"
                  title="Contact"
                  details="Reach out to me for anything and everything"
                  iconType="post-box"
                />
              </Link>
              <Card
                className="h-full cursor-pointer min-h-[8rem]"
                title="Projects"
                details="Check out some projects I'm currently working on"
                iconType="list"
              />
              <Card
                className="h-full cursor-pointer min-h-[8rem]"
                title="Design"
                details="Read about my favorite software design philosophies"
                badge="New"
                iconType="wrench"
              />
            </div>
          </div>
        </HeaderBottom>
      </header>

      <SideTitle />
      <Client />
    </div>
  );
}
