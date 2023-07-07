import { ContactFormProgressTracker } from "@open-system/contact-client-components";
import { Breadcrumb } from "@open-system/core-client-components";
import { Module } from "@open-system/design-system-components";
import { ReactNode } from "react";
import ContactFooter from "./contact-footer";
import ContactForm from "./contact-form";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="background-gradient relative z-20 flex min-h-screen w-full flex-col gap-12 px-20 pt-12">
      <Breadcrumb
        variant="primary"
        items={[
          { pathname: "/contact", label: "Contact" },
          { pathname: "/contact/business", label: "Business Opportunity" },
        ]}
      />

      <ContactForm>
        <Module
          className="h-fit w-full"
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
          }
          footer={<ContactFooter />}>
          <div className="relative flex min-h-[20rem] flex-row items-center gap-10 pt-10">
            {children}
            <ContactFormProgressTracker />
          </div>
        </Module>
      </ContactForm>
    </div>
  );
}
