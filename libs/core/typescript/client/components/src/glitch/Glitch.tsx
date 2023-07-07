"use client";

import { BaseComponentProps } from "@open-system/design-system-components";
import { useEffect, useRef } from "react";
// import BoxLogo from "../../../../../../assets/box-logo-primary.svg";
// import { GlitchCanvasManager } from "./Glitch.utils";

/*let isLoaded = false;
let glitch;



function draw() {
  clear();
  background(0);

  if (isLoaded) {

  }

  // fill(255, 255, 255);
  // textSize(14);
  // text('FPS: ' + floor(frameRate()), 20, 30);

}*/

export function Glitch({ className, ...props }: BaseComponentProps) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // const glitch = new GlitchCanvasManager(canvasRef, BoxLogo);
    // glitch.show();
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full"></canvas>;
}
