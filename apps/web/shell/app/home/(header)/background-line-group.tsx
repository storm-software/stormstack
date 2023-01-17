import { BaseComponentProps } from "@open-system/design-system-components";
import BackgroundLine from "./background-line";

export interface BackgroundLineGroupProps extends BaseComponentProps {
  count: number;
}

export default function BackgroundLineGroup({
  count = 6,
}: BackgroundLineGroupProps) {
  const lines = [];
  for (let index = 0; index < count; index++) {
    lines.push(
      <div className="relative h-[40px]">
        <BackgroundLine
          className="absolute top-0"
          width={500 + index * 1}
          strokeWidth={0.2}
        />
        <BackgroundLine
          className="absolute top-[10px]"
          width={500 + index * 1}
          strokeWidth={0.1}
        />
        <BackgroundLine
          className="absolute top-[20px]"
          width={500 + index * 1}
          strokeWidth={0.1}
        />
        <BackgroundLine
          className="absolute top-[30px]"
          width={500 + index * 1}
          strokeWidth={0.1}
        />
      </div>
    );
  }

  return <div className="z-bg flex flex-col">{lines.map(line => line)}</div>;
}
