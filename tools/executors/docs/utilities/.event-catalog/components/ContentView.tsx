import { PencilIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Admonition from "./Mdx/Admonition";

interface ContentViewProps {
  title: string;
  subtitle?: string;
  tags?: { href?: string; label: string }[];
  lastModifiedDate: string;
  children: JSX.Element;
  sidebar: JSX.Element;
  breadCrumbs: JSX.Element;
  editUrl?: string;
  version?: string;
  isOldVersion?: boolean;
  latestVersionUrl?: string;
  draft?: boolean;
}

export default function ContentView({
  title,
  subtitle,
  tags = [],
  lastModifiedDate,
  children,
  sidebar: SideBar,
  breadCrumbs: BreadCrumbs,
  editUrl,
  isOldVersion,
  latestVersionUrl,
  version,
  draft: isDraft = false,
}: ContentViewProps) {
  return (
    <div className="relative flex">
      <div className=" flex w-0 flex-1 flex-col ">
        <main className="flex-1 ">
          <div className="py-8 xl:py-10">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-7xl xl:grid-cols-4">
              <div className="flex flex-col justify-between xl:col-span-3 xl:border-r xl:border-gray-200 xl:pr-8">
                <div>
                  {BreadCrumbs && (
                    <div className="mb-5 border-b border-gray-100 pb-4">
                      {BreadCrumbs}
                    </div>
                  )}
                  <div>
                    <div>
                      <div className="flex justify-between pb-4 xl:border-b ">
                        <div className="w-full space-y-2">
                          <h1 className="relative text-3xl font-bold text-gray-900">
                            {title}
                            <div className="relative -top-1 ml-2 inline-block">
                              {tags.map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="relative -top-0.5 ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                  {tag.label}
                                </span>
                              ))}
                              {isDraft && (
                                <span className="relative -top-0.5 ml-2 inline-flex items-center rounded-full bg-gray-500 px-2.5 py-0.5 text-xs font-medium text-gray-100">
                                  Draft
                                </span>
                              )}
                            </div>
                          </h1>
                          <div className="text mb-10 py-2 text-gray-600">
                            {subtitle}
                          </div>
                          {isOldVersion && version && (
                            <Admonition
                              className="mt-0 w-full pt-0"
                              type="warning">
                              <>
                                You are currently viewing an old version of this
                                event ({version}).
                                <Link
                                  className="mt-2 block pl-7 text-sm text-blue-500 underline"
                                  href={latestVersionUrl}>
                                  Read latest version &rarr;
                                </Link>
                              </>
                            </Admonition>
                          )}
                        </div>
                        <div className="mt-4 flex space-x-3 md:mt-0">
                          {editUrl && (
                            <a
                              href={editUrl}
                              target="_blank"
                              type="button"
                              className="hidden h-10 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 md:inline-flex"
                              rel="noreferrer">
                              <PencilIcon
                                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span>Edit</span>
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="py-3 xl:pb-0 xl:pt-6">
                        {isDraft && (
                          <Admonition className="mt-0 pt-0" type="warning">
                            <>
                              This event is currently in{" "}
                              <span className="underline">draft</span> mode.
                            </>
                          </Admonition>
                        )}

                        <div className="prose max-w-none">{children}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`mt-10 flex ${
                    editUrl ? "justify-between" : "justify-end"
                  }`}>
                  {editUrl && (
                    <a
                      href={editUrl}
                      target="_blank"
                      className="flex text-gray-400"
                      rel="noreferrer">
                      <PencilIcon
                        className="relative top-1 mr-2 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Edit this page</span>
                    </a>
                  )}
                  <span className="mt-2 text-xs italic">
                    Last updated on {lastModifiedDate}
                  </span>
                </div>
              </div>
              <div className="md:min-h-screen">{SideBar}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
