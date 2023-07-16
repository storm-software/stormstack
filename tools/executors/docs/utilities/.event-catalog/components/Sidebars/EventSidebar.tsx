import type { Event } from "@eventcatalog/types";
import {
  ArrowDownTrayIcon,
  CircleStackIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import getConfig from "next/config";
import Link from "next/link";

import ExternalLinks from "./components/ExternalLinks";
import ItemList from "./components/ItemList";
import Owners from "./components/Owners";
import Tags from "./components/Tags";

interface EventSideBarProps {
  event: Event;
  urlPath: string;
  loadedVersion?: string;
  isOldVersion?: boolean;
}

const getServiceLink = (serviceName: string, event: Event) => {
  const allEventServices = [...event.consumers, ...event.producers];
  const matchedService = allEventServices.find(
    service => service.name === serviceName
  );
  if (matchedService && matchedService.domain)
    return `/domains/${matchedService.domain}/services/${serviceName}`;
  return `/services/${serviceName}`;
};

const getEventLogsURL = (event: Event) =>
  event.domain
    ? `/domains/${event.domain}/events/${event.name}/logs`
    : `/events/${event.name}/logs`;

function EventSideBar({
  event,
  loadedVersion,
  isOldVersion,
  urlPath,
}: EventSideBarProps) {
  const {
    name: eventName,
    owners,
    producerNames: producers,
    consumerNames: consumers,
    tags,
    historicVersions,
    externalLinks,
    schema,
    domain,
  } = event;
  const { publicRuntimeConfig: { basePath = "" } = {} } = getConfig();

  const getSchemaDownloadURL = () => {
    if (!schema) return null;
    return isOldVersion
      ? `${basePath}/schemas/${eventName}/${loadedVersion}/schema.${schema.extension}`
      : `${basePath}/schemas/${eventName}/schema.${schema.extension}`;
  };

  return (
    <aside className="hidden divide-y divide-gray-200 xl:block xl:pl-8">
      <h2 className="sr-only">Details</h2>

      {producers.length > 0 && (
        <ItemList
          title={`Producers (${producers.length})`}
          titleIcon={{ icon: CubeIcon, className: "text-green-400" }}
          items={producers.map(producer => ({
            label: producer,
            href: getServiceLink(producer, event),
            bgColor: "green",
          }))}
        />
      )}

      {consumers.length > 0 && (
        <ItemList
          title={`Consumers (${consumers.length})`}
          titleIcon={{ icon: CubeIcon, className: "text-indigo-400" }}
          items={consumers.map(consumer => ({
            label: consumer,
            href: getServiceLink(consumer, event),
            bgColor: "indigo",
          }))}
        />
      )}

      {domain && (
        <div className="space-y-8 py-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">
              <CircleStackIcon
                className="mr-2 inline-block h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
              Domain
            </h2>
            <ul className="mt-2 leading-8">
              <li className="inline">
                <Link
                  className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                  href={`/domains/${domain}`}>
                  <div className="absolute flex flex-shrink-0 items-center justify-center">
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
      {historicVersions.length > 0 && (
        <div className=" py-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">
              Event Versions
            </h2>
            <ul className="mt-2 text-left leading-8 text-blue-500">
              <li className="inline text-sm ">
                <Link href={urlPath}>
                  <span
                    className={`relative -top-0.5 mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      loadedVersion === "latest"
                        ? "bg-blue-400 font-bold text-white underline shadow-md"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                    Latest
                  </span>
                </Link>
              </li>

              {historicVersions.map(version => {
                const isLoadedVersion = loadedVersion === version;
                const styles = isLoadedVersion
                  ? "bg-blue-400 text-white shadow-md font-bold underline"
                  : "bg-blue-100 text-blue-800";
                return (
                  <li className="inline text-sm" key={version}>
                    <Link href={`${urlPath}/v/${version}`}>
                      <span
                        className={`relative -top-0.5 mr-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium  ${styles}`}>
                        v{version}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {owners.length > 0 && <Owners owners={owners} />}

      <div className=" space-y-1 py-6">
        {schema && (
          <a
            href={getSchemaDownloadURL()}
            download={`${eventName}(${event.version}).${schema.extension}`}
            className="hidden h-10 w-full justify-center rounded-md border border-gray-300 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 md:inline-flex">
            <ArrowDownTrayIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-200"
              aria-hidden="true"
            />
            <span>Download Schema</span>
          </a>
        )}

        {historicVersions.length > 0 && (
          <Link
            className="hidden h-10 w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 md:inline-flex"
            href={getEventLogsURL(event)}>
            <span>View Changes</span>
          </Link>
        )}

        <Link
          className="hidden h-10 w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 md:inline-flex"
          href={`/visualiser?type=event&name=${eventName}`}>
          <span>View in Visualiser</span>
        </Link>

        {externalLinks.length > 0 && (
          <ExternalLinks externalLinks={externalLinks} />
        )}
        {tags.length > 0 && <Tags tags={tags} />}
      </div>
    </aside>
  );
}

export default EventSideBar;
