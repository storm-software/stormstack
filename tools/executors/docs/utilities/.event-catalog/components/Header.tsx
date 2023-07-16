import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useConfig } from "../hooks/EventCatalog";

const defaultNavigation = [
  { label: "Events", href: "/events" },
  { label: "Services", href: "/services" },
  { label: "Domains", href: "/domains" },
  { label: "Visualiser", href: "/visualiser" },
  { label: "3D Node Graph", href: "/overview" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const {
    title,
    homepageLink,
    logo,
    headerLinks: configNavigation,
  } = useConfig();
  const router = useRouter();

  const { publicRuntimeConfig: { basePath = "" } = {} } = getConfig();
  const logoToLoad = logo || { alt: "Open System Logo", src: `logo.svg` };

  const headerNavigation = configNavigation || defaultNavigation;

  return (
    <div className="bg-bg-primary">
      <div className="mx-auto max-w-7xl  ">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center font-bold text-white">
              {!homepageLink && (
                <Link className="flex items-center" href="/">
                  <img
                    alt="logo"
                    className="mr-3 inline-block w-12 text-white"
                    src={`${basePath}/${logoToLoad.src}`}
                  />
                  <span className="text-xl">{title}</span>
                </Link>
              )}
              {homepageLink && (
                <a href={homepageLink} className="flex items-center">
                  <img
                    alt="logo"
                    className="mr-3 inline-block w-8 text-white"
                    src={`${basePath}/${logoToLoad.src}`}
                  />
                  <span className="text-xl">{title}</span>
                </a>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {headerNavigation.map(item => {
                const current = router.pathname === item.href;
                return (
                  <Link
                    className={classNames(
                      current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    aria-current={current ? "page" : undefined}
                    key={item.label}
                    href={item.href}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
