import { ContactFormProgressTracker } from "@open-system/contact-feature-form";
import { Breadcrumb } from "@open-system/core-components";
import { Module } from "@open-system/design-system-components";
import { ReactNode } from "react";
import { handleSubmit } from "./actions";
import ContactForm from "./contact-form";
import ContactFooter from "./contact-footer";

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

      <ContactForm onSubmit={handleSubmit}>
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
          <div className="relative flex flex-row items-center gap-10 pt-10 min-h-[20rem]">
            {children}
            <ContactFormProgressTracker />
          </div>
        </Module>
      </ContactForm>
    </div>
  );
}
