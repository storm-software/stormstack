"use client";

export interface StackLayerProps {
  label: string;
}

export default function StackLayer({ label, ...props }: StackLayerProps) {
  return (
    <div className="transition-all">
      <div className="h-[350px] w-[40px] origin-[0%_0%] rotate-90 -skew-x-[30deg] scale-y-[0.864] border-2 border-slate-900 bg-teal-500"></div>
      <div className="relative bottom-[350px] h-[40px] w-[350px] origin-[0%_0%] -rotate-[30deg] -skew-x-[30deg] scale-y-[0.864] border-2 border-slate-900 bg-teal-600"></div>
      <div className="relative bottom-[370px] h-[0px] w-[550px] origin-[0%_0%] -rotate-[30deg] -skew-x-[30deg] scale-y-[0.864] border-b-4 border-primary">
        <label className="absolute -right-36 rotate-[26deg] skew-x-[26deg] text-2xl text-primary hover:text-secondary">
          {label}
        </label>
      </div>
      <div className="relative bottom-[390px] h-[350px] w-[350px] origin-[0%_0%] rotate-[210deg] -skew-x-[30deg] scale-y-[0.864] border-2 border-slate-900 bg-teal-400"></div>
    </div>
  );
}
