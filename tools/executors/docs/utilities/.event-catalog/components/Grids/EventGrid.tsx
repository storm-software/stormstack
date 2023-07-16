import Link from "next/link";

import { CircleStackIcon, CubeIcon } from "@heroicons/react/24/outline";

import { Event } from "@eventcatalog/types";
import getBackgroundColor from "../../utils/random-bg";

import NodeGraph from "../../components/Mdx/NodeGraph/NodeGraph";
import Mermaid from "../../components/Mermaid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface EventGridProps {
  events: Event[];
  showMermaidDiagrams?: boolean;
  showNodeGraphs?: boolean;
}

function EventGrid({
  events = [],
  showMermaidDiagrams = false,
  showNodeGraphs = false,
}: EventGridProps) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
      {events.map(event => {
        const { draft: isDraft, domain } = event;
        const eventURL = domain
          ? `/domains/${domain}/events/${event.name}`
          : `/events/${event.name}`;
        const eventKey = domain ? `${domain}-${event.name}` : event.name;

        return (
          <li key={eventKey} className="flex">
            <Link className="flex w-full rounded-md shadow-sm" href={eventURL}>
              <div
                style={{
                  background: getBackgroundColor(event.name),
                }}
                className={classNames(
                  "bg-red-500",
                  "flex w-4 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                )}
              />
              <div className="w-full rounded-r-md border-b border-r border-t border-gray-200 bg-white ">
                <div className="flex h-full flex-col justify-between space-y-2 p-4 text-sm">
                  <div className="break-all font-bold text-gray-900 hover:text-gray-600">
                    {event.name}
                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      v{event.version}
                    </span>
                    {event.badges?.map(badge => (
                      <span
                        key={`${event.name}-${badge.content}`}
                        className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${badge.backgroundColor}-100 text-${badge.textColor}-800`}>
                        {badge.content}
                      </span>
                    ))}
                    {isDraft && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-gray-500 px-2.5 py-0.5 text-xs font-medium text-gray-100">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-normal text-gray-500 ">
                    {event.summary}
                  </div>
                  {showMermaidDiagrams && (
                    <div className="flex h-full items-center">
                      <Mermaid
                        source="event"
                        data={event}
                        rootNodeColor={getBackgroundColor(event.name)}
                      />
                    </div>
                  )}
                  {showNodeGraphs && (
                    <div className="flex h-full items-center">
                      <NodeGraph
                        source="event"
                        data={event}
                        rootNodeColor={getBackgroundColor(event.name)}
                      />
                    </div>
                  )}
                  <div className="relative bottom-0 left-0 flex space-x-4 pt-2 text-xs">
                    <div className=" font-medium text-gray-500">
                      <CubeIcon
                        className="mr-2 inline-block h-4 w-4 text-green-400"
                        aria-hidden="true"
                      />
                      Producers ({event.producerNames.length})
                    </div>
                    <div className=" font-medium text-gray-500">
                      <CubeIcon
                        className="mr-2 inline-block h-4 w-4 text-indigo-400"
                        aria-hidden="true"
                      />
                      Subscribers ({event.consumerNames.length})
                    </div>
                    {event.domain && (
                      <div className=" font-medium text-gray-500">
                        <CircleStackIcon
                          className="mr-2 inline-block h-4 w-4 text-yellow-400"
                          aria-hidden="true"
                        />
                        {event.domain}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default EventGrid;
