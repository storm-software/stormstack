import { ServerIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

function Node({ type, label }: any) {
  const Icon = type === "event" ? EnvelopeIcon : ServerIcon;
  return (
    <div>
      <Icon className="-mt-0.5 mr-1 inline-block h-3 w-3 text-gray-700" />
      <span className="text-gray-700">{label}</span>
    </div>
  );
}

export default Node;
