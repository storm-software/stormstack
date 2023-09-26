import { BaseComponentProps } from "@stormstack/design-system-components";
import clsx from "clsx";
import { Link } from "../link";
import { GitHubLink } from "../github-link";
import { LinkedInLink } from "../linkedin-link";
import { KeybaseLink } from "../keybase-link";
import { MediumLink } from "../medium-link";

export function SocialMediaLinks({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("grid-cols-2 gap-4 lg:grid-cols-4 grid", className)}>
      <GitHubLink />
      <LinkedInLink />
      <KeybaseLink />
      <MediumLink />
    </div>
  );
}
