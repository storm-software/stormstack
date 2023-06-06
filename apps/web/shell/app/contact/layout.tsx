import { Module, BreadcrumbVariants } from "@open-system/design-system-components";
import { ReactNode } from "react";
import { Breadcrumb } from "@open-system/core-components";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-fit flex-col gap-12 px-20 pt-12">
      <Breadcrumb
        variant="secondary"
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
              <span className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
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
