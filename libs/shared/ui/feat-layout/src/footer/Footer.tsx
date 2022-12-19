"use client";

import {
  BaseComponentProps,
  Divider,
  Heading,
  LinkVariants,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import Logo from "../../../../../../assets/box-logo-gradient.svg";
import GithubLogo from "../../assets/github-icon.svg";
import KeybaseLogo from "../../assets/keybase-icon.svg";
import LinkedInLogo from "../../assets/linkedin-icon.svg";
import MediumLogo from "../../assets/medium-icon.svg";
import { FooterForm } from "./footer-form";

export function Footer({ className, ...props }: BaseComponentProps) {
  return (
    <div className="mt-28 h-[50rem] w-full overflow-hidden">
      <div className="card absolute bottom-0 z-0 h-96 w-full">
        <div className="halftone h-full w-full"></div>
      </div>

      <div className="absolute bottom-0 z-10 w-full px-0 pt-28 lg:px-20">
        <div className="z-footer w-full rounded-t-lg bg-white shadow-md">
          <div className="via-footer/85 flex h-full w-full flex-col rounded-t-lg bg-gradient-to-br from-footer/100 to-footer/80 bg-[length:100%_100%] bg-bottom bg-no-repeat">
            <div className="flex w-full flex-1 flex-col gap-6 py-6 px-5 md:px-10 lg:px-20">
              <div className="flex flex-row gap-16">
                <FooterForm className="w-full" />
                <div className="hidden flex-row items-center justify-center xl:flex">
                  <Link className="h-[18rem] w-[26rem]">
                    <Logo className="h-[18rem] w-[26rem]" />
                  </Link>
                </div>
              </div>
              <Divider />
              <div className="flex flex-row gap-16">
                <div className="flex flex-col gap-2">
                  <Heading className="whitespace-nowrap" level={3}>
                    Navigation
                  </Heading>
                  <div className="flex flex-row gap-16">
                    <div className="flex flex-col gap-2">
                      <Link variant={LinkVariants.SECONDARY}>Home</Link>
                      <Link variant={LinkVariants.SECONDARY}>About</Link>
                      <Link variant={LinkVariants.SECONDARY}>Contact</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link variant={LinkVariants.SECONDARY}>Projects</Link>
                      <Link variant={LinkVariants.SECONDARY}>Privacy</Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Heading className="whitespace-nowrap" level={3}>
                    Blog
                  </Heading>
                  <Link variant={LinkVariants.SECONDARY}>Articles</Link>
                  <Link variant={LinkVariants.SECONDARY}>Latest</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <Heading className="whitespace-nowrap" level={3}>
                    Documentation
                  </Heading>
                  <Link variant={LinkVariants.SECONDARY}>Open System</Link>
                  <Link variant={LinkVariants.SECONDARY}>Design System</Link>
                  <Link variant={LinkVariants.SECONDARY}>Storybook</Link>
                </div>
                <div className="flex flex-row items-center justify-center">
                  <div className="flex flex-col gap-0.5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Link
                        className="h-[5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-105"
                        target="_blank"
                        href="https://github.com/sullivanpj">
                        <GithubLogo className="h-[5rem] w-[5rem]" />
                      </Link>
                      <Link
                        className="h-[5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-105"
                        target="_blank"
                        href="https://keybase.io/sullivanp">
                        <KeybaseLogo className="h-[5rem] w-[5rem]" />
                      </Link>
                      <Link
                        className="h-[5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-105"
                        target="_blank"
                        href="https://www.linkedin.com/in/patrick-sullivan-865526b0">
                        <LinkedInLogo className="h-[5rem] w-[5rem]" />
                      </Link>
                      <Link
                        className="h-[5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-105"
                        target="_blank">
                        <MediumLogo className="h-[5rem] w-[5rem]" />
                      </Link>
                    </div>
                    <div className="flex flex-col text-center">
                      <label className="text-md font-body-1 text-primary">
                        Patrick J. Sullivan
                      </label>
                      <label className="text-md font-body-1 text-primary">
                        New York Metropolitan Area
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row justify-center pt-2 pb-3">
              <p className="text-sm font-body-1 text-gray-400">
                Copyright © 2023. Patrick Sullivan Development. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
