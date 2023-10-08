import type { Owner } from "@eventcatalog/types";
import Link from "next/link";
import { useUser } from "../../../hooks/EventCatalog";

function Owners({ owners }: { owners: Owner[] | string[] }) {
  const { getUserById } = useUser();

  return (
    <div className=" space-y-8 py-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Domain Owners ({owners.length})
        </h2>
        <ul className="mt-4 space-y-2 leading-8">
          {owners.map(owner => {
            const user = getUserById(owner);

            if (!user) return null;

            return (
              <li className="flex justify-start" key={user.id}>
                <Link
                  className="space-x-3 flex items-center"
                  href={`/users/${user.id}`}>
                  <div className="flex-shrink-0">
                    <img
                      className="h-5 w-5 rounded-full"
                      src={user.avatarUrl}
                      alt=""
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Owners;
