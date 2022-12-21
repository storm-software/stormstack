import { Heading, PropsWithBase } from "@open-system/design-system-components";

type TechnologyGroupProps = PropsWithBase<{
  name: string;
}>;

export default function TechnologyGroup({
  name,
  children,
}: TechnologyGroupProps) {
  return (
    <div className="relative flex h-[45rem] w-fit flex-col justify-center gap-10">
      <Heading level={4} className="mx-10 w-fit whitespace-nowrap text-5xl">
        {name}
      </Heading>
      <div className="flex flex-row items-center justify-center gap-10">
        {children}
      </div>
    </div>
  );
}
