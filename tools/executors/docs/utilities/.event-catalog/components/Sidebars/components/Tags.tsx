import type { Tag } from "@eventcatalog/types";
import { TagIcon } from "@heroicons/react/24/outline";

const tailwindBgs = ["purple", "pink", "green", "yellow", "blue", "indigo"];

function Tags({ tags }: { tags: Tag[] }) {
  return (
    <div className=" space-y-8 py-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          <TagIcon
            className="mr-2 inline-block h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Tags
        </h2>
        <div className="mt-3 space-y-2">
          {tags.map(({ label, url }, index) => {
            const color = tailwindBgs[index % tailwindBgs.length];

            if (url) {
              return (
                <a
                  key={index}
                  href={url}
                  className="inline-block underline"
                  target="_blank"
                  rel="noreferrer">
                  <span
                    className={`relative -top-0.5 mr-2 inline-block items-center rounded-full px-2.5 py-0.5 text-xs font-medium underline bg-${color}-100 text-${color}-800`}>
                    {label}
                  </span>
                </a>
              );
            }

            return (
              <span
                key={index}
                className={`relative -top-0.5 mr-2 inline-block items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}>
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Tags;
