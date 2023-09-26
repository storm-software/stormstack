"use client";

import { PropsWithBase } from "@stormstack/design-system-components";
import { LikeButton as LikeButtonInner } from "@stormstack/reaction-ui-feature-like/like-button";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

type LikeButtonClientProps = PropsWithBase<{
  contentId: string;
  count: number;
}>;

export default function LikeButtonClient(props: LikeButtonClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  useEffect(() => {
    if (
      "EventSource" in window &&
      process.env.NEXT_PUBLIC_REACTION_PUBLISHER_URL
    ) {
      /*const eventSource = new EventSource(
        process.env.NEXT_PUBLIC_REACTION_PUBLISHER_URL
      );
      eventSource.onmessage = () => {
        startTransition(() => {
          router.refresh();
        });
      };*/
    }
  }, [router]);

  return <LikeButtonInner {...props} />;
}
