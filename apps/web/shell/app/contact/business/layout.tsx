"use client";

import {
  contactFormProgressAtom,
  useSetContactFormProgress,
} from "@open-system/contact-data-access";
import { useAtomValue } from "jotai";
import { ReactNode, useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { reset } = useSetContactFormProgress();
  const steps = useAtomValue(contactFormProgressAtom);
  useEffect(() => {
    (!steps || steps.length === 0) && reset("business");
  }, []);

  return <>{children}</>;
}
