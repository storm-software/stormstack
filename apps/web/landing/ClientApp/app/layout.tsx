import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-1100">
        <nav>
          <div className="flex flex-row gap-2">
            <Link href="/" className="rounded-lg bg-gray-900 hover:bg-gray-800">
              Home
            </Link>
            <Link
              href="/contact"
              className="rounded-lg bg-gray-900 hover:bg-gray-800">
              Contact
            </Link>
            <Link
              href="/about"
              className="rounded-lg bg-gray-900 hover:bg-gray-800">
              About
            </Link>
          </div>
        </nav>

        <div className="lg:pl-72">{children}</div>
      </body>
    </html>
  );
}
