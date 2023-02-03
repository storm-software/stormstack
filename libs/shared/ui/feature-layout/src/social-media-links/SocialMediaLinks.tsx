import { BaseComponentProps } from "@open-system/design-system-components";
import { Link } from "@open-system/shared-ui-components";
import clsx from "clsx";
import GithubLogo from "../../assets/github-icon.svg";
import KeybaseLogo from "../../assets/keybase-icon.svg";
import LinkedInLogo from "../../assets/linkedin-icon.svg";
import MediumLogo from "../../assets/medium-icon.svg";

export function SocialMediaLinks({ className, ...props }: BaseComponentProps) {
  return (
    <div className={clsx("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      <Link
        className="h-[5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-110"
        inNewTab={true}
        href="https://github.com/sullivanpj">
        <GithubLogo className="h-[5rem] w-[5rem]" />
      </Link>
      <Link
        className="h-[5.5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-110"
        inNewTab={true}
        href="https://www.linkedin.com/in/patrick-sullivan-865526b0">
        <LinkedInLogo className="h-[5.5rem] w-[5rem]" />
      </Link>
      <Link
        className="h-[5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-110"
        inNewTab={true}
        href="https://keybase.io/sullivanp">
        <KeybaseLogo className="h-[5rem] w-[5rem]" />
      </Link>
      <Link
        className="h-[5.5rem] w-[5rem] transition-transform hover:translate-y-0.5 hover:scale-110"
        inNewTab={true}>
        <MediumLogo className="h-[5.5rem] w-[5rem]" />
      </Link>
    </div>
  );
}
