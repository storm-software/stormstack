import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-800">
      <head />
      <body className="relative h-fit bg-gradient-to-b from-bg-1 via-bg-1/80 to-bg-1/0">
        <div className="h-[1000px] lg:pl-72">{children}</div>
      </body>
    </html>
  );
}
