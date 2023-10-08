import Link from "next/link";

import { CircleStackIcon, CubeIcon } from "@heroicons/react/24/outline";

import { Event } from "@eventcatalog/types";
import getBackgroundColor from "../../utils/random-bg";

import NodeGraph from "../Mdx/NodeGraph/NodeGraph";
import Mermaid from "../Mermaid";

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
  showNodeGraphs = false
}: EventGridProps) {
  return (
    <ul className="mt-3 grid-cols-1 gap-5 md:grid-cols-2 grid">
      {events.map(event => {
        const { draft: isDraft, domain } = event;
        const eventURL = domain
          ? `/domains/${domain}/events/${event.name}`
          : `/events/${event.name}`;
        const eventKey = domain ? `${domain}-${event.name}` : event.name;

        return (
          <li key={eventKey} className="flex">
            <Link className="w-full rounded-md shadow-sm flex" href={eventURL}>
              <div
                style={{
                  background: getBackgroundColor(event.name)
                }}
                className={classNames(
                  "bg-red-500",
                  "w-4 flex-shrink-0 rounded-l-md text-sm font-medium text-white flex items-center justify-center"
                )}
              />
              <div className="w-full rounded-r-md border-b border-r border-t border-gray-200 bg-white ">
                <div className="h-full space-y-2 p-4 text-sm flex flex-col justify-between">
                  <div className="font-bold text-gray-900 hover:text-gray-600 break-all">
                    {event.name}
                    <span className="ml-2 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 inline-flex items-center">
                      v{event.version}
                    </span>
                    {event.badges?.map(badge => (
                      <span
                        key={`${event.name}-${badge.content}`}
                        className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center bg-${badge.backgroundColor}-100 text-${badge.textColor}-800`}>
                        {badge.content}
                      </span>
                    ))}
                    {isDraft && (
                      <span className="ml-2 rounded-full bg-gray-500 px-2.5 py-0.5 text-xs font-medium text-gray-100 inline-flex items-center">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-normal text-gray-500 ">
                    {event.summary}
                  </div>
                  {showMermaidDiagrams && (
                    <div className="h-full flex items-center">
                      <Mermaid
                        source="event"
                        data={event}
                        rootNodeColor={getBackgroundColor(event.name)}
                      />
                    </div>
                  )}
                  {showNodeGraphs && (
                    <div className="h-full flex items-center">
                      <NodeGraph
                        source="event"
                        data={event}
                        rootNodeColor={getBackgroundColor(event.name)}
                      />
                    </div>
                  )}
                  <div className="bottom-0 left-0 space-x-4 pt-2 text-xs relative flex">
                    <div className=" font-medium text-gray-500">
                      <CubeIcon
                        className="mr-2 h-4 w-4 text-green-400 inline-block"
                        aria-hidden="true"
                      />
                      Producers ({event.producerNames.length})
                    </div>
                    <div className=" font-medium text-gray-500">
                      <CubeIcon
                        className="mr-2 h-4 w-4 text-indigo-400 inline-block"
                        aria-hidden="true"
                      />
                      Subscribers ({event.consumerNames.length})
                    </div>
                    {event.domain && (
                      <div className=" font-medium text-gray-500">
                        <CircleStackIcon
                          className="mr-2 h-4 w-4 text-yellow-400 inline-block"
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
