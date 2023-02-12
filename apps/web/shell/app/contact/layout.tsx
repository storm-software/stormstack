import { Module } from "@open-system/design-system-components";
import React from "react";
import Breadcrumb from "../(components)/breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-fit w-full flex-col gap-12 p-20 pt-12">
      <Breadcrumb
        items={[
          { pathname: "/contact", label: "Contact" },
          { pathname: "/contact/business", label: "Business Opportunity" },
        ]}
      />
      <Module
        className="h-fit min-h-[40rem]"
        header={
          <>
            It&apos;s a{" "}
            <span className="bg-gradient-to-r from-primary to-primary bg-[length:100%_8px] bg-bottom bg-no-repeat px-1">
              <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                pleasure
              </span>
            </span>{" "}
            to meet you!
          </>
        }>
        {children}
      </Module>
    </div>
  );
}
