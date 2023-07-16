import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function ExternalLinks({ externalLinks }: { externalLinks: any[] }) {
  if (externalLinks.length === 0) return null;
  return (
    <div className=" space-y-8 py-2">
      <div className="space-y-3">
        {externalLinks.map(tag => (
          <a
            href={tag.url}
            target="_blank"
            type="button"
            className="hidden h-10 w-full justify-center rounded-md border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800 shadow-sm hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 md:inline-flex"
            rel="noreferrer"
            key={tag.url}>
            <ArrowTopRightOnSquareIcon
              className="-ml-1 mr-2 h-5 w-5 text-teal-200"
              aria-hidden="true"
            />
            <span>{`${tag.label}`}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default ExternalLinks;
