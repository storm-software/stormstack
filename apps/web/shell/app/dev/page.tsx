import { SideTitle } from "@open-system/shared-components/server";
import Client from "./client";

export default async function Page() {
  return (
    <div className="flex h-full w-full flex-col">
      <Client />
    </div>
  );
}
