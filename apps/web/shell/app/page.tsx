import {
  Link,
  ScrollArrowIndicator,
  ScrollProgressBar,
} from "@open-system/core-components";
import { Card } from "@open-system/design-system-components";
import { SideTitle } from "@open-system/shared-components";
import AppTitle from "../components/app-title";
import HeaderBottom from "../components/header-bottom";
import SubscriptionCard from "../components/subscription-card";
import VhsTitleBar from "../components/vhs-title-bar";
import Client from "./client";

export default function Page() {
  return (
    <div className="relative h-full w-full">
      <div className="z-progress">
        <ScrollProgressBar />
      </div>

      <div className="z-scroll">
        <ScrollArrowIndicator />
      </div>

      <header className="relative flex h-fit min-h-[220vh] flex-col overflow-hidden lg:min-h-[200vh]">
        <div className="relative h-[150vh] min-h-screen w-full">
          <div className="absolute top-0 z-10 h-full w-full overflow-hidden bg-fixed pb-10">
            <div className="relative h-full w-full">
              <div className="absolute left-10 top-10 z-30 h-48 w-64 border-l-[10px] border-t-[10px] border-l-gray-500/40 border-t-gray-500/40">
                <div className="relative m-5 flex flex-row items-center gap-3">
                  <div className="h-8 w-8 animate-flash rounded-full bg-red-800/40" />
                  <label className="font-vhs text-6xl font-black text-red-800/40">
                    REC
                  </label>
                </div>
              </div>
              <div className="absolute right-10 top-10 z-30 h-48 w-64 border-r-[10px] border-t-[10px] border-r-gray-500/40 border-t-gray-500/40">
                <div className="relative flex w-full flex-row-reverse items-start pr-10">
                  <svg
                    className="h-20 origin-center -rotate-90 fill-gray-500/40"
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

              <div className="absolute bottom-[50vh] left-10 z-30 h-48 w-64 border-b-[10px] border-l-[10px] border-b-gray-500/40 border-l-gray-500/40" />
              <div className="absolute bottom-[50vh] right-10 z-30 h-48 w-64 border-b-[10px] border-r-[10px] border-b-gray-500/40 border-r-gray-500/40" />

              <div className="absolute bottom-[47vh] left-64 right-64 z-30 flex flex-row items-center">
                <VhsTitleBar />
              </div>

              <div className="absolute left-0 top-0 z-20 h-full w-full overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)] after:content-['']">
                <div className="tv-static absolute -bottom-52 -left-52 -right-52 -top-52 animate-tv-static opacity-[35%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-20 z-title h-fit w-full">
          <div className="relative h-fit w-full">
            <AppTitle />
          </div>
        </div>

        <HeaderBottom>
          <div className="background-gradient flex w-full flex-1 flex-col items-center justify-center px-4 pb-32">
            <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <SubscriptionCard />
              <Card
                className="h-full min-h-[8rem] cursor-pointer"
                title="Resume"
                details="Download a copy of my resume"
                iconType="download"
              />
              <Card
                className="h-full min-h-[8rem] cursor-pointer"
                title="Articles"
                details="Read some recent articles I've written"
                iconType="pencil"
              />
              <Link href="/contact">
                <Card
                  className="h-full min-h-[8rem] cursor-pointer"
                  title="Contact"
                  details="Reach out to me for anything and everything"
                  iconType="post-box"
                />
              </Link>
              <Card
                className="h-full min-h-[8rem] cursor-pointer"
                title="Projects"
                details="Check out some projects I'm currently working on"
                iconType="list"
              />
              <Card
                className="h-full min-h-[8rem] cursor-pointer"
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
