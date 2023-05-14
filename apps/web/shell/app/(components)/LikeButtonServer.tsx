import { PropsWithBase } from "@open-system/design-system-components";
import { connection } from "../../redis/connection";
import { getRepository } from "../../redis/reaction-repository";
import LikeButtonClient from "./LikeButtonClient";

// export const revalidate = 60;

export type LikeButtonProps = PropsWithBase<{
  contentId: string;
}>;

export default async function LikeButton({
  className,
  contentId,
  ...props
}: LikeButtonProps) {
  const repository = await getRepository(connection);
  const result = await repository
    .search()
    .where("contentId")
    .equals(contentId)
    .and("type")
    .equals("like")
    .return.all();

  return (
    <div className="fixed right-0 top-3/4 z-like">
      <LikeButtonClient
        {...props}
        contentId={contentId}
        count={result.length > 0 ? (result[0].count as number) ?? 0 : 0}
      />
    </div>
  );
}
