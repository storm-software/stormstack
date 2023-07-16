import Link from "next/link";

import { CubeIcon } from "@heroicons/react/24/outline";

import { Domain } from "@eventcatalog/types";

import getBackgroundColor from "../../utils/random-bg";

interface DomainGridProps {
  domains: Domain[];
}

function DomainGrid({ domains = [] }: DomainGridProps) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
      {domains.map(domain => (
        <li key={domain.name} className="flex">
          <Link
            className="flex w-full shadow-sm"
            href={`/domains/${domain.name}`}>
            <div
              style={{
                background: getBackgroundColor(domain.name),
              }}
              className="w-4 rounded-l-md"
            />
            <div className="w-full rounded-r-md border-b border-r border-t border-gray-200 bg-white ">
              <div className="flex h-full flex-col justify-between space-y-2 p-4 text-sm">
                <div>
                  <span className="font-bold text-gray-900">{domain.name}</span>
                  {domain.badges?.map(badge => (
                    <span
                      key={`${domain.name}-${badge.content}`}
                      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${badge.backgroundColor}-100 text-${badge.textColor}-800`}>
                      {badge.content}
                    </span>
                  ))}
                  <div className="mt-2 line-clamp-3 text-xs font-normal text-gray-500">
                    {domain.summary}
                  </div>
                </div>
                <div className="relative bottom-0 left-0 flex space-x-4 pt-2 text-xs">
                  <div className=" font-medium text-gray-500">
                    <CubeIcon
                      className="mr-2 inline-block h-4 w-4 text-green-400"
                      aria-hidden="true"
                    />
                    Services ({domain.services.length})
                  </div>
                  <div className=" font-medium text-gray-500">
                    <CubeIcon
                      className="mr-2 inline-block h-4 w-4 text-indigo-400"
                      aria-hidden="true"
                    />
                    Events ({domain.events.length})
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default DomainGrid;
