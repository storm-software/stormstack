import { BaseComponentProps } from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import clsx from "clsx";
import GitHubLink from "./github-link";
import LinkedInLink from "./linkedin-link";
import KeybaseLink from "./keybase-link";
import MediumLink from "./medium-link";

export function SocialMediaLinks({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      <GitHubLink />
      <LinkedInLink />
      <KeybaseLink />
      <MediumLink />
    </div>
  );
}
