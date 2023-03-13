import RocketSvg from "./rocket.svg";

export default function Rocket() {
  return (
    <div className="animate-float-rocket relative h-36 w-20">
      <RocketSvg className="absolute top-0 left-0 right-0 z-20 h-32 w-20" />
      <div className="absolute bottom-6 left-[34%] z-0 h-5 w-5 animate-exhaust3 rounded-full bg-slate-300"></div>
      <div className="absolute bottom-7 left-[44%] z-10 h-6 w-6 animate-exhaust1 rounded-full bg-slate-300"></div>
      <div className="absolute bottom-5 left-[34%] z-10 h-5 w-5 animate-exhaust1 rounded-full bg-slate-200"></div>
      <div className="absolute bottom-4 left-[44%] z-0 h-6 w-6 animate-exhaust2 rounded-full bg-slate-200"></div>
      <div className="absolute bottom-2 left-[44%] z-10 h-5 w-5 animate-exhaust3 rounded-full bg-slate-300"></div>
      <div className="absolute bottom-3 left-[44%] z-0 h-4 w-4 animate-exhaust2 rounded-full bg-slate-200"></div>
      <div className="absolute bottom-2 left-[42%] z-10 h-5 w-5 animate-exhaust2 rounded-full bg-slate-300"></div>
      <div className="absolute bottom-3 left-[44%] z-0 h-3 w-3 animate-exhaust3 rounded-full bg-slate-200"></div>
      <div className="absolute bottom-1 left-[42%] z-0 h-6 w-6 animate-exhaust1 rounded-full bg-slate-300"></div>
      <div className="absolute bottom-0 left-[44%] z-10 h-3 w-3 animate-exhaust1 rounded-full bg-slate-200"></div>
      <div className="absolute -bottom-1 left-[52%] z-10 h-3 w-3 animate-exhaust3 rounded-full bg-slate-300"></div>
    </div>
  );
}
