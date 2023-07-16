import Link from "next/link";

import { CubeIcon } from "@heroicons/react/24/outline";

import { Service } from "@eventcatalog/types";
import Mermaid from "../../components/Mermaid";

import NodeGraph from "../../components/Mdx/NodeGraph/NodeGraph";
import getBackgroundColor from "../../utils/random-bg";

interface ServiceGridProps {
  services: Service[];
  showMermaidDiagrams?: boolean;
  showNodeGraphs?: boolean;
}

function ServiceGrid({
  services = [],
  showMermaidDiagrams = false,
  showNodeGraphs = false,
}: ServiceGridProps) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
      {services.map(service => {
        const { draft: isDraft, domain } = service;
        const serviceUrl = domain
          ? `/domains/${domain}/services/${service.name}`
          : `/services/${service.name}`;
        return (
          <li key={service.name} className="flex">
            <Link className="flex w-full shadow-sm" href={serviceUrl}>
              <div
                style={{
                  background: getBackgroundColor(service.name),
                }}
                className="w-4 rounded-l-md"
              />
              <div className="w-full rounded-r-md border-b border-r border-t border-gray-200 bg-white ">
                <div className="flex h-full flex-col justify-between space-y-2 p-4 text-sm">
                  <div>
                    <span className="font-bold text-gray-900">
                      {service.name}
                    </span>
                    {service.badges?.map(badge => (
                      <span
                        key={`${service.name}-${badge.content}`}
                        className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${badge.backgroundColor}-100 text-${badge.textColor}-800`}>
                        {badge.content}
                      </span>
                    ))}
                    {isDraft && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-gray-500 px-2.5 py-0.5 text-xs font-medium text-gray-100">
                        Draft
                      </span>
                    )}
                    <div className="mt-2 line-clamp-3 text-xs font-normal text-gray-500">
                      {service.summary}
                    </div>
                  </div>
                  {showMermaidDiagrams && (
                    <div className="flex h-full items-center">
                      <Mermaid
                        source="service"
                        data={service}
                        rootNodeColor={getBackgroundColor(service.name)}
                      />
                    </div>
                  )}
                  {showNodeGraphs && (
                    <div className="flex h-full items-center">
                      <NodeGraph
                        source="service"
                        data={service}
                        rootNodeColor={getBackgroundColor(service.name)}
                      />
                    </div>
                  )}
                  <div className="relative bottom-0 left-0 flex space-x-4 pt-2 text-xs">
                    <div className=" font-medium text-gray-500">
                      <CubeIcon
                        className="mr-2 inline-block h-4 w-4 text-green-400"
                        aria-hidden="true"
                      />
                      Subscribe Events ({service.subscribes.length})
                    </div>
                    <div className=" font-medium text-gray-500">
                      <CubeIcon
                        className="mr-2 inline-block h-4 w-4 text-indigo-400"
                        aria-hidden="true"
                      />
                      Publish Events ({service.publishes.length})
                    </div>
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

export default ServiceGrid;
