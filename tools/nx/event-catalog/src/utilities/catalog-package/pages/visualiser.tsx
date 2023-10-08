import type { Domain, Event, Service } from "@eventcatalog/types";
import debounce from "lodash.debounce";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import NodeGraph from "../components/Mdx/NodeGraph/NodeGraph";
import { useConfig } from "../hooks/EventCatalog";
import { getAllDomains } from "../lib/domains";
import { getAllEvents } from "../lib/events";
import { getAllServices } from "../lib/services";
import getBackgroundColor from "../utils/random-bg";

const filterByString = (filter, data) =>
  data.filter(item => item.name.indexOf(filter) > -1);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export interface PageProps {
  events: Event[];
  services: Service[];
  domains: Domain[];
}

function Graph({ events, services, domains }: PageProps) {
  const { title } = useConfig();
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedRootNode, setSelectedRootNode] = useState<any>();
  const [listItemsToRender, setListItemsToRender] = useState({
    events,
    services,
    domains
  });

  const router = useRouter();
  const { query, isReady: isRouterReady } = router;
  const { name, type } = query;

  const dropdownValues = [
    ...events.map(event => ({
      ...event,
      type: "event",
      label: `Event: ${event.name}`
    })),
    ...services.map(event => ({
      ...event,
      type: "service",
      label: `Service: ${event.name}`
    })),
    ...domains.map(event => ({
      ...event,
      type: "domain",
      label: `Domain: ${event.name}`
    }))
  ];

  const navItems = [
    { title: "Domains", type: "domain", data: listItemsToRender.domains },
    { title: "Events", type: "event", data: listItemsToRender.events },
    { title: "Services", type: "service", data: listItemsToRender.services }
  ];

  const handleListItemSelection = (
    data: Event | Service,
    dataType: "event" | "service" | "domain"
  ) => {
    router.push({ query: `type=${dataType}&name=${data.name}` });
    setSelectedRootNode({ label: data.name, data, type: dataType });
  };

  const handleAllEventsAndServicesSelection = () => {
    router.push({ query: `type=all&name=AllEventsAndServices` });
    setSelectedRootNode({
      label: "All Events and Services",
      data: { name: "All Events and Services", events, services },
      type: "all"
    });
  };

  const searchOnChange = useCallback(
    debounce(e => {
      setSearchFilter(e.target.value);
    }, 500),
    [listItemsToRender]
  );

  const handleDropdownSelect = e => {
    const { value } = e.target;
    const selectedItem = JSON.parse(value);
    setSelectedRootNode(selectedItem);
  };

  const getListItemsToRender = useCallback(() => {
    if (!searchFilter) return { events, services, domains };
    return {
      events: filterByString(searchFilter, events),
      services: filterByString(searchFilter, services),
      domains: filterByString(searchFilter, domains)
    };
  }, [events, services, domains, searchFilter]);

  useEffect(() => {
    const filteredListItems = getListItemsToRender();
    setListItemsToRender(filteredListItems);
  }, [searchFilter, getListItemsToRender]);

  useEffect(() => {
    if (!isRouterReady) return;

    const initialDataToLoad = events[0];
    const initialSelectedRootNode = {
      label: initialDataToLoad.name,
      type: "event",
      data: initialDataToLoad
    };

    if (!name || !type) {
      setSelectedRootNode(initialSelectedRootNode);
      return;
    }

    if (type === "all") {
      setSelectedRootNode({
        label: "All Events and Services",
        data: { name: "All Events and Services", events, services },
        type: "all"
      });
      return;
    }

    const dataByType = { event: events, service: services, domain: domains };
    const match = dataByType[type.toString()].find(item => item.name === name);
    const newSelectedItem = match
      ? { label: match.name, type, data: match }
      : initialSelectedRootNode;
    setSelectedRootNode(newSelectedItem);
  }, [name, type, events, domains, services, isRouterReady]);

  return (
    <div className="h-screen overflow-hidden">
      <Head>
        <title>{title} - Visualiser</title>
      </Head>
      <div className="border-b border-gray-300 bg-gray-200 px-4 py-2 sm:hidden">
        <div className="rounded-md shadow-sm relative">
          <select
            className=" w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm block focus:outline-none"
            onChange={handleDropdownSelect}>
            <option>Please select your event or service</option>
            {dropdownValues.map(item => (
              <option
                key={item.name}
                value={JSON.stringify({
                  label: item.name,
                  data: item,
                  type: item.type
                })}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid-cols-8 xl:grid-cols-6 grid">
        <div className="col-span-2 h-screen border-r-2 border-gray-200 bg-white px-4  py-3 shadow-md sm:block xl:col-span-1 hidden overflow-auto">
          <div className="border-b border-gray-200 pb-6">
            <div className="mt-1 rounded-md shadow-sm relative">
              <div className="inset-y-0 left-0 pl-3 pointer-events-none absolute flex items-center">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="event"
                id="event"
                onChange={searchOnChange}
                placeholder="Find Event, Service or Domain"
                className="w-full rounded-md border-gray-300 pl-10 focus:border-gray-500 focus:ring-gray-500 sm:text-sm block"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex">
              <button
                type="button"
                className="w-full rounded-md border shadow-sm flex text-left"
                onClick={() => handleAllEventsAndServicesSelection()}>
                <div
                  className={classNames(
                    "bg-blue-500",
                    "h-full w-4 flex-shrink-0 rounded-l-md text-sm font-medium text-white flex items-center justify-center"
                  )}
                />
                <div
                  className={`w-full rounded-r-md border-b border-r border-t ${
                    selectedRootNode?.type === "all"
                      ? "bg-green-50"
                      : "bg-white"
                  }`}>
                  <div className="h-full space-y-2 p-4 text-sm flex flex-col justify-between">
                    <div className="xl:text-md text-xs font-bold text-gray-900 hover:text-gray-600 break-all">
                      All Events and Services
                    </div>
                    <div className="mt-2 text-xs font-normal text-gray-500 xl:block hidden ">
                      Diagram that shows all your events and services in one
                      place
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {navItems.map((navItem: any) => (
              <SelectionGroup
                key={navItem.title}
                title={navItem.title}
                filterBy={searchFilter}
                data={navItem.data}
                currentSelectedItem={selectedRootNode}
                type={navItem.type}
                onClick={handleListItemSelection}
              />
            ))}
          </div>
        </div>
        <div className="col-span-12 h-screen bg-gray-200 sm:col-span-6  xl:col-span-5">
          {selectedRootNode && (
            <NodeGraph
              source={selectedRootNode.type}
              data={selectedRootNode.data}
              title="Visualiser"
              subtitle={`${selectedRootNode.data.name} (${selectedRootNode.type})`}
              rootNodeColor={getBackgroundColor(selectedRootNode.label)}
              fitView
              isAnimated
              isDraggable
              includeBackground
              renderWithBorder={false}
              maxHeight="100%"
              includeEdgeLabels
              includeNodeIcons
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface SelectionGroupProps {
  title: string;
  data: Service[] | Event[] | Domain[];
  type: "event" | "service" | "domain";
  // eslint-disable-next-line no-unused-vars
  onClick(data: Event | Service | Domain, type: string): void;
  currentSelectedItem?: any;
  filterBy?: string;
}

function SelectionGroup({
  title,
  data,
  currentSelectedItem,
  onClick,
  filterBy,
  type
}: SelectionGroupProps) {
  const [dataWithoutFilter] = useState(data);

  return (
    <div>
      <span className="py-2 font-bold block">
        {title} {` `}
        {filterBy && (
          <>
            ({data.length}/{dataWithoutFilter.length})
          </>
        )}
        {!filterBy && <>({dataWithoutFilter.length})</>}
      </span>
      {data.length === 0 && (
        <span className="text-sm text-gray-300">No {type}s found</span>
      )}
      <ul className="space-y-4 overflow-auto">
        {data.map(item => {
          const isSelected = currentSelectedItem
            ? currentSelectedItem.label === item.name
            : false;
          const itemKey = hasDomain(item)
            ? `${item.domain}-${item.name}}`
            : item.name;

          return (
            <ListItem
              type={type}
              key={itemKey}
              data={item}
              onClick={selectedItem => onClick(selectedItem, type)}
              isSelected={isSelected}
            />
          );
        })}
      </ul>
    </div>
  );
}

function hasDomain(item: Service | Event | Domain): item is Service | Event {
  return (item as Service | Event).domain != null;
}

interface ListItemProps {
  data: Service | Event;
  // eslint-disable-next-line no-unused-vars
  onClick(data: Event | Service | Domain, type: string): void;
  type: "event" | "service" | "domain";
  isSelected: boolean;
}

function ListItem({ data, onClick, type, isSelected }: ListItemProps) {
  const border = isSelected ? "border-green-500 bg-green-50 shadow-md " : "";
  return (
    <li className="flex">
      <button
        type="button"
        onClick={() => onClick(data, type)}
        className={`w-full rounded-md border shadow-sm flex text-left ${border}`}>
        <div
          style={{
            background: getBackgroundColor(data.name)
          }}
          className={classNames(
            "bg-red-500",
            "h-full w-4 flex-shrink-0 rounded-l-md text-sm font-medium text-white flex items-center justify-center"
          )}
        />
        <div
          className={`w-full rounded-r-md border-b border-r border-t ${
            isSelected ? "bg-green-50" : "bg-white"
          }`}>
          <div className="h-full space-y-2 p-4 text-sm flex flex-col justify-between">
            <div className="xl:text-md text-xs font-bold text-gray-900 hover:text-gray-600 break-all">
              {data.name}
            </div>
            <div className="mt-2 text-xs font-normal text-gray-500 xl:block hidden ">
              {data.summary}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}

export default Graph;

export const getStaticProps = async () => {
  const events = getAllEvents({ hydrateEvents: true });
  const services = getAllServices();
  const domains = await getAllDomains();

  return {
    props: {
      events,
      services,
      domains: domains.map(data => data.domain)
    }
  };
};
