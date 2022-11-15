import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row gap-2">
      <div className="lg:pl-72">{children}</div>
    </div>
  );
}
