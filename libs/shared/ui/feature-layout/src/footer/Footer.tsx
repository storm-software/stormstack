"use client";

import {
  BaseComponentProps,
  Divider,
  DividerSizes,
  DividerVariants,
  LinkVariants,
} from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import Logo from "../../../../../../assets/box-logo-gradient.svg";
import { SocialMediaLinks } from "../social-media-links";
import { FooterForm } from "./footer-form";

export function Footer({ className, ...props }: BaseComponentProps) {
  return (
    <div className="relative z-footer mt-36 w-full bg-bg-footer bg-cover bg-no-repeat">
      <div className="flex h-full w-full flex-col border-t border-t-slate-400 backdrop-blur-3xl backdrop-brightness-50">
        <div className="flex w-full flex-1 flex-col gap-6 px-8 pb-3 pt-16 sm:px-10 md:px-12 lg:px-16">
          <div className="flex flex-row gap-16">
            <FooterForm className="w-full" />
            <div className="hidden flex-row items-center justify-center lg:flex">
              <Link className="h-[20rem] w-[28rem]">
                <Logo className="h-[20rem] w-[28rem]" />
              </Link>
            </div>
          </div>
          <Divider size={DividerSizes.MEDIUM} variant={DividerVariants.LIGHT} />
          <div className="flex flex-col items-center justify-center gap-16 lg:flex-row lg:items-start">
            <div className="flex flex-col gap-2">
              <h3 className="whitespace-nowrap text-center font-footer-name text-4xl text-slate-300">
                Navigation
              </h3>
              <div className="flex flex-row gap-16">
                <div className="flex flex-col gap-1">
                  <Link variant={LinkVariants.SECONDARY}>Home</Link>
                  <Link variant={LinkVariants.SECONDARY}>About</Link>
                  <Link variant={LinkVariants.SECONDARY}>Contact</Link>
                </div>
                <div className="flex flex-col gap-1">
                  <Link variant={LinkVariants.SECONDARY}>Projects</Link>
                  <Link variant={LinkVariants.SECONDARY}>Privacy</Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="whitespace-nowrap text-center font-footer-name text-4xl text-slate-300">
                Blog
              </h3>
              <Link variant={LinkVariants.SECONDARY}>Articles</Link>
              <Link variant={LinkVariants.SECONDARY}>Latest</Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="whitespace-nowrap text-center font-footer-name text-4xl text-slate-300">
                Docs
              </h3>
              <Link variant={LinkVariants.SECONDARY}>Open System</Link>
              <Link variant={LinkVariants.SECONDARY}>Design System</Link>
              <Link variant={LinkVariants.SECONDARY}>Storybook</Link>
            </div>
            <div></div>
            <div className="flex flex-1 flex-col items-center justify-center sm:flex-row">
              <div className="flex w-fit flex-col gap-0.5">
                <SocialMediaLinks />
                <div className="flex flex-col text-center">
                  <label className="font-footer-name text-lg text-primary">
                    Patrick J. Sullivan
                  </label>
                  <label className="text-md font-footer-name text-primary">
                    New York Metropolitan Area
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 flex flex-row items-center justify-center lg:hidden">
          <Link className="h-[20rem] w-[28rem]">
            <Logo className="h-[20rem] w-[28rem]" />
          </Link>
        </div>
        <div className="flex w-full flex-row justify-center pt-2 pb-3">
          <p className="font-footer-copyright text-sm text-gray-400">
            Copyright © 2023. Pat Sullivan Development. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
