import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-800">
      <head />
      <body>
        <div className="h-[1000px]">{children}</div>
      </body>
    </html>
  );
}
