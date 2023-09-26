import { ContactFormProgressTracker } from "@stormstack/contact-client-components";
import { Breadcrumb } from "@stormstack/core-client-components";
import { Module } from "@stormstack/design-system-components";
import { ReactNode } from "react";
import ContactFooter from "./contact-footer";
import ContactForm from "./contact-form";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="background-gradient z-20 min-h-screen w-full gap-12 px-20 pt-12 relative flex flex-col">
      <Breadcrumb
        variant="primary"
        items={[
          { pathname: "/contact", label: "Contact" },
          { pathname: "/contact/business", label: "Business Opportunity" }
        ]}
      />

      <ContactForm>
        <Module
          className="h-fit w-full"
          header={
            <>
              It&apos;s a{" "}
              <span className="bg-gradient-to-r from-primary to-primary bg-bottom px-1 bg-[length:100%_8px] bg-no-repeat">
                <span className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-transparent bg-clip-text">
                  pleasure
                </span>
              </span>{" "}
              to meet you!
            </>
          }
          footer={<ContactFooter />}>
          <div className="gap-10 pt-10 relative flex min-h-[20rem] flex-row items-center">
            {children}
            <ContactFormProgressTracker />
          </div>
        </Module>
      </ContactForm>
    </div>
  );
}
