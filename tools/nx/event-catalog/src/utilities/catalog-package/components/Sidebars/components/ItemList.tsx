import { CubeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function ItemList({
  title,
  titleIcon: { icon: Icon = CubeIcon, className: iconClassName },
  items
}: any) {
  return (
    <div className="space-y-8 py-6 pt-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          <Icon
            className={`mr-2 h-5  w-5 inline-block ${iconClassName}`}
            aria-hidden="true"
          />
          {title}
        </h2>
        <ul className="mt-2 leading-8">
          {items.map(item => (
            <li className="mr-2 inline" key={item.label}>
              <Link
                className="rounded-full border border-gray-300 px-3 py-0.5 relative inline-flex items-center"
                href={item.href}>
                <div className="flex-shrink-0 absolute flex items-center justify-center">
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-${item.bgColor}-500`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3.5 max-w-xs text-sm font-medium text-gray-900 truncate">
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
