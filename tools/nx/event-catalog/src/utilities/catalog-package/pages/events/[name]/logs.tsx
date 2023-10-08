import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import { useEffect } from "react";

import "diff2html/bundles/css/diff2html.min.css";
import * as Diff2Html from "diff2html/lib/ui/js/diff2html-ui-slim";

import { Event } from "@eventcatalog/types";
import { CommandLineIcon } from "@heroicons/react/24/solid";
import BreadCrumbs from "../../../components/BreadCrumbs";

import {
  getAllEvents,
  getEventByName,
  getLogsForEvent
} from "../../../lib/events";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface LogsProps {
  changes: any;
  event: Event;
  breadCrumbs: any;
}

function Logs({ changes, event, breadCrumbs }: LogsProps) {
  const { version: currentVersion, name: eventName } = event;

  const getEventUrl = (version: string) => {
    const isVersionCurrentVersion = version === currentVersion;
    if (event.domain) {
      return isVersionCurrentVersion
        ? `/domains/${event.domain}/events/${eventName}`
        : `/domains/${event.domain}/events/${eventName}/v/${version}`;
    }
    return isVersionCurrentVersion
      ? `/events/${eventName}`
      : `/events/${eventName}/v/${version}`;
  };

  useEffect(() => {
    const configuration = {
      drawFileList: false,
      matching: "lines",
      highlight: true,
      fileListToggle: false,
      outputFormat: "side-by-side"
    };

    changes.forEach((diff, index) => {
      if (diff.value) {
        const targetElement = document.getElementById(`code-diff-${index}`);

        const diff2htmlUi = new Diff2Html.Diff2HtmlUI(
          targetElement,
          diff.value,
          configuration as Diff2Html.Diff2HtmlUIConfig
        );
        diff2htmlUi.draw();
        diff2htmlUi.highlightCode();
      }
    });
  }, [changes]);

  return (
    <div className="min-h-screen relative flex">
      <div className=" w-0 flex-1 flex flex-col ">
        <main className="flex-1 ">
          <div className="py-8 xl:py-10">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-7xl xl:grid-cols-4">
              <div className="xl:col-span-4 flex flex-col justify-between ">
                <div className="mb-5 border-b border-gray-100 pb-4">
                  <BreadCrumbs pages={breadCrumbs} />
                </div>
                <div>
                  <div className="mb-4 border-b pb-4 flex justify-between">
                    <div className="w-full space-y-2">
                      <h1 className="text-3xl font-bold text-gray-900 relative">
                        {eventName}
                      </h1>
                    </div>
                  </div>

                  {changes.length === 0 && (
                    <div className="text-xl text-gray-400">
                      No versions for Event found.
                    </div>
                  )}

                  <div className="mb-20 flow-root">
                    <ul className="">
                      {changes.map((data, eventIdx) => (
                        <li key={eventIdx} className="">
                          <div className="pb-8 relative">
                            {eventIdx !== changes.length - 1 ? (
                              <span
                                className="left-4 top-4 -ml-px h-full w-0.5 bg-gray-100 absolute"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="space-x-3 relative flex">
                              <div>
                                <span
                                  className={classNames(
                                    "h-8 w-8 rounded-full bg-blue-500 text-xs text-white ring-8 ring-white flex items-center justify-center"
                                  )}>
                                  <CommandLineIcon className="h-4 w-4" />
                                  {/* {event.versions[0]} */}
                                </span>
                              </div>
                              <div>
                                <div>
                                  <p className="text-xl font-bold text-gray-800">
                                    Schema version update
                                    {data.versions.map((version, index) => (
                                      <Link
                                        className="font-medium"
                                        key={version}
                                        href={getEventUrl(version)}>
                                        {index === 0 && ` from`}
                                        <span className="px-1 text-blue-500 underline">
                                          {version}
                                          {version === currentVersion
                                            ? "(latest)"
                                            : ""}
                                        </span>
                                        {index === 0 && `to`}
                                      </Link>
                                    ))}
                                  </p>
                                  {data.changelog.source && (
                                    <>
                                      <h2 className="mt-4 border-b border-gray-100 pb-2 text-xl font-bold text-blue-500">
                                        Changelog
                                      </h2>
                                      <div className="mt-2 max-w-none prose">
                                        <MDXRemote {...data.changelog.source} />
                                      </div>
                                    </>
                                  )}
                                  {!data.changelog.source && (
                                    <h2 className="mt-4 text-base font-bold text-gray-300">
                                      No changelog file found.
                                    </h2>
                                  )}
                                </div>
                                <div className="py-4 text-sm text-gray-500 text-right">
                                  <div id={`code-diff-${eventIdx}`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ params }) => {
  const { name: eventName } = params;

  const history = await getLogsForEvent({ eventName });
  const { event } = await getEventByName({ eventName });

  return {
    props: {
      changes: history,
      event,
      breadCrumbs: [
        { name: "Events", href: "/events", current: false },
        { name: event.name, href: `/events/${event.name}`, current: false },
        { name: "Logs", href: `/events/${event.name}/history`, current: true }
      ]
    }
  };
};

export async function getStaticPaths() {
  const events = getAllEvents();
  const eventsWithoutDomains = events.filter(event => !event.domain);
  const paths = eventsWithoutDomains.map(event => ({
    params: { name: event.name }
  }));

  return {
    paths,
    fallback: false
  };
}

export default Logs;
