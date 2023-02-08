import React from "react";
import PersistGate from "../(components)/persist-gate";
import ContactForm from "./contact-form";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-fit w-full flex-col gap-12 p-20 pt-24">
      <div className="rounded-3xl border-[1px] border-slate-500 bg-gradient-to-bl from-slate-900 via-slate-900 to-black p-8">
        <header className="pb-8">
          <h1 className="ml-3 text-7xl font-header-1 text-primary">
            It&apos;s a{" "}
            <span className="bg-gradient-to-r from-primary to-primary bg-[length:100%_8px] bg-bottom bg-no-repeat px-1">
              <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                pleasure
              </span>
            </span>{" "}
            to meet you!
          </h1>
        </header>
        <main className="flex flex-col gap-12">
          <PersistGate>
            <ContactForm>{children}</ContactForm>
          </PersistGate>
        </main>
      </div>
    </div>
  );
}
