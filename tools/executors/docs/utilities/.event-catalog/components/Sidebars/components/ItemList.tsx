import { CubeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function ItemList({
  title,
  titleIcon: { icon: Icon = CubeIcon, className: iconClassName },
  items,
}: any) {
  return (
    <div className="space-y-8 py-6 pt-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          <Icon
            className={`mr-2 inline-block  h-5 w-5 ${iconClassName}`}
            aria-hidden="true"
          />
          {title}
        </h2>
        <ul className="mt-2 leading-8">
          {items.map(item => (
            <li className="mr-2 inline" key={item.label}>
              <Link
                className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                href={item.href}>
                <div className="absolute flex flex-shrink-0 items-center justify-center">
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-${item.bgColor}-500`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3.5 max-w-xs truncate text-sm font-medium text-gray-900">
                  {item.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ItemList;
