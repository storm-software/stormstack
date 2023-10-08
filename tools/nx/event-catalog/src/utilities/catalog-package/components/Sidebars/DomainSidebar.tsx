import type { Domain } from "@eventcatalog/types";
import { CubeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ExternalLinks from "./components/ExternalLinks";
import ItemList from "./components/ItemList";
import Owners from "./components/Owners";
import Tags from "./components/Tags";

interface DomainSideBarProps {
  domain: Domain;
}

function ServiceSidebar({ domain }: DomainSideBarProps) {
  const { name, owners, services, events, tags = [], externalLinks } = domain;

  return (
    <aside className="divide-y divide-gray-200 xl:block xl:pl-8 hidden">
      <h2 className="sr-only">Details</h2>

      {events.length > 0 && (
        <ItemList
          title={`Events (${events.length})`}
          titleIcon={{ icon: CubeIcon, className: "text-indigo-400" }}
          items={events.map(event => ({
            label: event.name,
            href: `/domains/${name}/events/${event.name}`,
            bgColor: "indigo"
          }))}
        />
      )}

      {services.length > 0 && (
        <ItemList
          title={`Services (${services.length})`}
          titleIcon={{ icon: CubeIcon, className: "text-green-400" }}
          items={services.map(service => ({
            label: service.name,
            href: `/domains/${name}/services/${service.name}`,
            bgColor: "green"
          }))}
        />
      )}

      {owners.length > 0 && <Owners owners={owners} />}

      <Link
        className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 md:inline-flex hidden justify-center focus:outline-none"
        href={`/visualiser?type=domain&name=${domain.name}`}>
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
