import { Domain, Event, Service } from "@eventcatalog/types";
import DomainGrid from "../../components/Grids/DomainGrid";
import EventGrid from "../../components/Grids/EventGrid";
import ServiceGrid from "../../components/Grids/ServiceGrid";

import { getAllDomainsByOwnerId } from "../../lib/domains";
import { getAllEventsByOwnerId, getAllOwners } from "../../lib/events";
import { getAllServicesByOwnerId } from "../../lib/services";

import { useUser } from "../../hooks/EventCatalog";

interface UserPageProps {
  events: Event[];
  services: Service[];
  domains: Domain[];
  userId: string;
}

export default function UserPage({
  events,
  services,
  domains,
  userId,
}: UserPageProps) {
  const { getUserById } = useUser();

  const user = getUserById(userId);

  return (
    <div className="relative flex min-h-screen">
      <div className="flex-1 ">
        <div className="py-8 xl:py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-7xl xl:grid-cols-4">
            <div className="min-h-screen xl:col-span-3 xl:border-r xl:border-gray-200 xl:pr-8">
              <div className="flex justify-between pb-4 xl:border-b ">
                <div className="space-y-2">
                  <h1 className="relative text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                </div>
              </div>
              {events.length > 0 && (
                <div className="border-b border-gray-100 pb-6">
                  <h1 className="relative mt-4 text-lg font-bold text-gray-800">
                    Owner of Events ({events.length})
                  </h1>
                  <EventGrid events={events} />
                </div>
              )}
              {services.length > 0 && (
                <div className="border-b border-gray-100 pb-6">
                  <h1 className="relative mt-4 text-lg font-bold text-gray-800 ">
                    Owner of Services ({services.length})
                  </h1>
                  <ServiceGrid services={services} />
                </div>
              )}
              {domains.length > 0 && (
                <div>
                  <h1 className="relative mt-4 text-lg font-bold text-gray-800">
                    Owner of Domains ({domains.length})
                  </h1>
                  <DomainGrid domains={domains} />
                </div>
              )}
            </div>
            <div className="px-8">
              <div className="mt-4 flex items-center space-x-5 ">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={user.avatarUrl}
                      alt=""
                    />
                    <span
                      className="absolute inset-0 rounded-full shadow-inner"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    {user.role}
                  </p>
                </div>
              </div>
              <div className="mt-6 flow-root border-t border-gray-200 py-6 text-sm">
                {user.summary}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ params }) => {
  const { id: userId } = params;
  const userEvents = await getAllEventsByOwnerId(userId);
  const services = await getAllServicesByOwnerId(userId);
  const domains = await getAllDomainsByOwnerId(userId);

  return {
    props: {
      events: userEvents,
      domains,
      services,
      userId,
    },
  };
};

export async function getStaticPaths() {
  const owners = await getAllOwners();

  const paths = owners.map(owner => ({ params: { id: owner } }));

  return {
    paths,
    fallback: false,
  };
}
