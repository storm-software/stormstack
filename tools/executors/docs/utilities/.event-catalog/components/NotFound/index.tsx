import { PlusCircleIcon } from "@heroicons/react/24/solid";

interface NotFoundProps {
  type: "service" | "event" | "domain";
  name: string;
  editUrl?: string;
}

export default function Example(props: NotFoundProps) {
  const { type, name, editUrl } = props;

  return (
    <main className="h-screen min-h-full bg-cover bg-top sm:bg-top">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-700 text-opacity-50 blur-xl">
          Failed to find {type}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Missing Documentation
        </h1>
        <p className="mt-2 text-center text-lg font-medium text-gray-700 text-opacity-50 ">
          Documentation for {type} is missing!
          <span className="mx-auto block max-w-2xl break-all py-4 font-bold text-gray-800 underline">
            {name}
          </span>
        </p>
        <p className="mt-4 text-xs text-gray-400">
          Help the eco-system and add the documentation for others ❤️{" "}
        </p>
        {editUrl && (
          <div className="mt-12">
            <a
              href={editUrl}
              target="_blank"
              className="inline-flex items-center rounded-md border border-transparent bg-black bg-opacity-75 px-4 py-2 text-sm font-medium text-white "
              rel="noreferrer">
              <PlusCircleIcon
                className="-ml-1 mr-2 h-5 w-5"
                aria-hidden="true"
              />
              Add missing <span className="px-1 underline">{type}</span>{" "}
              documentation
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
