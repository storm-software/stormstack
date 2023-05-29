import { Card } from "@open-system/design-system-components";
import {
  ScrollArrowIndicator,
  ScrollProgressBar,
  SideTitle,
} from "@open-system/shared-ui-feature-layout";
import AppTitle from "../components/app-title";
import Barcode from "../components/barcode";
import HeaderBottom from "../components/header-bottom";
import Client from "./client";

export default function Page() {
  return (
    <div className="h-full w-full">
      <ScrollProgressBar />
      <div className="z-scroll">
        <ScrollArrowIndicator />
      </div>

      <header className="relative flex h-fit min-h-[220vh] flex-col overflow-hidden lg:min-h-[200vh]">
        <div className="relative h-[150vh] min-h-screen w-full">
          <div className="absolute top-0 h-full w-full overflow-hidden bg-fixed pb-10 z-10">
            <div className="relative h-full w-full">
              <div className="absolute left-0 top-0 z-20 h-full w-full overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)] after:content-['']">
                <div className="tv-static absolute -bottom-52 -left-52 -right-52 -top-52 animate-tv-static opacity-[35%]"></div>
              </div>
              <div className="absolute left-0 top-[75vh] z-30">
                <div className="relative">
                  <Barcode className="glowing origin-top-left -rotate-[90deg]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-24 z-title h-fit w-full">
          <div className="relative h-fit w-full">
            <AppTitle />
          </div>
        </div>

        <HeaderBottom>
          <div className="flex flex-1 w-full flex-col items-center justify-center px-4 pb-32 background-gradient">
            <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Subscribe"
                details="Receive email notifications on future updates"
                iconType="bell"
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Resume"
                details="Download a copy of my resume"
                iconType="download"
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Articles"
                details="Read some recent articles I've written"
                iconType="pencil"
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Contact"
                details="Reach out to me for anything and everything"
                iconType="postbox"
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Projects"
                details="Check out some projects I'm currently working on"
                iconType="list"
              />
              <Card
                className="h-full min-h-[8rem] hover:cursor-pointer"
                title="Design"
                details="Read about my favorite software design philosophies"
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
