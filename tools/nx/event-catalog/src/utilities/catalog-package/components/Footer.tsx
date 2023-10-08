import { useConfig } from "../hooks/EventCatalog";

export default function Footer() {
  const { organizationName, footerLinks: navigation = [] } = useConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
        {navigation && (
          <nav
            className="-mx-5 -my-2 flex flex-wrap justify-center"
            aria-label="Footer">
            {navigation.map(item => (
              <div key={item.label} className="px-5 py-2">
                <a
                  href={item.href}
                  className="text-base text-gray-500 hover:text-gray-400">
                  {item.label}
                </a>
              </div>
            ))}
          </nav>
        )}
        <p className="mt-8 text-base text-gray-400 text-center">
          Copyright © {year}{" "}
          <a
            className="underline"
            href="https://patsullivan.org"
            target="_blank"
            rel="noreferrer">
            Pat Sullivan Development
          </a>
        </p>
      </div>
    </footer>
  );
}
