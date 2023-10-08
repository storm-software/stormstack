import type { Event, Service } from "@eventcatalog/types";
import Link from "next/link";

import { CircleStackIcon, CubeIcon } from "@heroicons/react/24/outline";
import getBackgroundColor from "../../utils/random-bg";

import ExternalLinks from "./components/ExternalLinks";
import ItemList from "./components/ItemList";
import Owners from "./components/Owners";
import Tags from "./components/Tags";

const getURLForEvent = (event: Event): string =>
  event.domain
    ? `/domains/${event.domain}/events/${event.name}`
    : `/events/${event.name}`;

interface ServiceSideBarProps {
  service: Service;
}

function ServiceSidebar({ service }: ServiceSideBarProps) {
  const {
    owners,
    subscribes,
    publishes,
    repository,
    tags = [],
    externalLinks,
    domain
  } = service;
  const { language, url: repositoryUrl } = repository;

  let languages = [];

  if (language) {
    languages = Array.isArray(language) ? language : [language];
  }

  let trimmedUrl = "";

  if (repositoryUrl) {
    trimmedUrl = repositoryUrl.replace(/(^\w+:|^)\/\//, "");
  }

  return (
    <aside className="xl:block xl:pl-8 hidden ">
      <h2 className="sr-only">Details</h2>

      {publishes.length > 0 && (
        <ItemList
          title={`Publishes Events (${publishes.length})`}
          titleIcon={{ icon: CubeIcon, className: "text-indigo-400" }}
          items={publishes.map(event => ({
            label: event.name,
            href: getURLForEvent(event),
            bgColor: "indigo"
          }))}
        />
      )}

      {subscribes.length > 0 && (
        <ItemList
          title={`Subscribes to Events (${subscribes.length})`}
          titleIcon={{ icon: CubeIcon, className: "text-green-400" }}
          items={subscribes.map(event => ({
            label: event.name,
            href: getURLForEvent(event),
            bgColor: "green"
          }))}
        />
      )}

      {domain && (
        <div className="space-y-8 border-t border-gray-200 py-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">
              <CircleStackIcon
                className="mr-2 h-5 w-5 text-yellow-400 inline-block"
                aria-hidden="true"
              />
              Domain
            </h2>
            <ul className="mt-2 leading-8">
              <li className="inline" key={domain}>
                <Link
                  className="rounded-full border border-gray-300 px-3 py-0.5 relative inline-flex items-center"
                  href={`/domains/${domain}`}>
                  <div className="flex-shrink-0 absolute flex items-center justify-center">
                    <span
                      className="animate h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                    {domain}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {owners.length > 0 && <Owners owners={owners} />}

      {repository?.url && (
        <div className="space-y-8 border-t border-gray-200 py-6">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-500">Repository</h2>
            <ul className=" space-y-2 leading-8">
              <li className="flex justify-start">
                <a
                  href={repository?.url}
                  target="_blank"
                  className="space-x-3 text-sm text-blue-600 flex items-center underline"
                  rel="noreferrer">
                  {trimmedUrl}
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
      {languages.length > 0 && (
        <div className="space-y-8 border-t border-gray-200 py-6">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-500">Language</h2>
            {languages.map(value => (
              <div className="mt-2 relative flex items-center" key={value}>
                <div className="flex-shrink-0 absolute flex items-center justify-center">
                  <span
                    className="h-2 w-2 rounded-full"
                    aria-hidden="true"
                    style={{ background: getBackgroundColor(value) }}
                  />
                </div>
                <div className="ml-3.5 text-sm font-medium text-gray-900">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 md:inline-flex hidden justify-center focus:outline-none"
        href={`/visualiser?type=service&name=${service.name}`}>
        <span>View in Visualiser</span>
      </Link>

      {externalLinks.length > 0 && (
        <ExternalLinks externalLinks={externalLinks} />
      )}
      {tags.length > 0 && <Tags tags={tags} />}
    </aside>
  );
}

export default ServiceSidebar;
