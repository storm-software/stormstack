import { HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface BreadCrumbsProps {
  pages: { name: string; href: string; current: boolean }[];
  homePath?: string;
}

function BreadCrumbs({ pages, homePath = "/events" }: BreadCrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="space-x-4 flex items-center">
        <li>
          <Link className="text-gray-400 hover:text-gray-500" href={homePath}>
            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pages.map(page => (
          <li key={page.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
                href={page.href}>
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default BreadCrumbs;
