import { getRandomIntRange, IsServer } from "@open-system/core-utilities";
import { MutableRefObject, useCallback } from "react";

// ammount to add on each button press
const confettiCount = 20;
const sequinCount = 10;

// "physics" variables
const gravityConfetti = 0.3;
const gravitySequins = 0.55;
const dragConfetti = 0.075;
const dragSequins = 0.02;
const terminalVelocity = 3;

// colors, back side is darker for confetti flipping
const colors = [
  { front: "#7b5cff", back: "#6245e0" }, // Purple
  { front: "#b3c7ff", back: "#8fa5e5" }, // Light Blue
  { front: "#5c86ff", back: "#345dd1" }, // Darker Blue
];

// helper function to get initial velocities for confetti
// this weighted spread helps the confetti look more realistic
const initConfettoVelocity = (
  xRange: [number, number],
  yRange: [number, number]
) => {
  const x = getRandomIntRange(xRange[0], xRange[1] - 1);
  const range = yRange[1] - yRange[0] + 1;
  let y =
    yRange[1] -
    Math.abs(
      getRandomIntRange(0, range) + getRandomIntRange(0, range - 1) - range
    );
  if (y >= yRange[1] - 1) {
    // Occasional confetto goes higher than the max
    y += Math.random() < 0.25 ? getRandomIntRange(1, 3 - 1) : 0;
  }
  return { x: x, y: -y };
};

// Confetto Class
class Confetto {
  public randomModifier = getRandomIntRange(0, 99 - 1);
  public color = colors[Math.floor(getRandomIntRange(0, colors.length - 1))];
  public dimensions = {
    x: getRandomIntRange(5, 9 - 1),
    y: getRandomIntRange(8, 15 - 1),
  };
  public position = {
    x:
      this.canvas && this.button
        ? getRandomIntRange(
            this.canvas.width / 2 - this.button.offsetWidth / 4,
            this.canvas.width / 2 + this.button.offsetWidth / 4 - 1
          )
        : 0,
    y:
      this.canvas && this.button
        ? getRandomIntRange(
            this.canvas.height / 2 + this.button.offsetHeight / 2 + 8,
            this.canvas.height / 2 + 1.5 * this.button.offsetHeight - 8 - 1
          )
        : 0,
  };
  public rotation = getRandomIntRange(0, 2 * Math.PI - 1);
  public scale = {
    x: 1,
    y: 1,
  };
  public velocity = initConfettoVelocity([-9, 9], [6, 11]);

  constructor(public canvas: HTMLCanvasElement, public button: HTMLElement) {}

  public update = () => {
    // apply forces to velocity
    this.velocity.x -= this.velocity.x * dragConfetti;
    this.velocity.y = Math.min(
      this.velocity.y + gravityConfetti,
      terminalVelocity
    );
    this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // set position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // spin confetto by scaling y and set the color, .09 just slows cosine frequency
    this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
  };
}

// Sequin Class
class Sequin {
  public color =
    colors[Math.floor(getRandomIntRange(0, colors.length - 1))].back;
  public radius = getRandomIntRange(1, 2 - 1);
  public position = {
    x:
      this.canvas && this.button
        ? getRandomIntRange(
            this.canvas.width / 2 - this.button.offsetWidth / 3,
            this.canvas.width / 2 + this.button.offsetWidth / 3 - 1
          )
        : 0,
    y:
      this.canvas && this.button
        ? getRandomIntRange(
            this.canvas.height / 2 + this.button.offsetHeight / 2 + 8,
            this.canvas.height / 2 + 1.5 * this.button.offsetHeight - 8 - 1
          )
        : 0,
  };
  public velocity = {
    x: getRandomIntRange(-6, 6 - 1),
    y: getRandomIntRange(-8, -12 - 1),
  };

  constructor(public canvas: HTMLCanvasElement, public button: HTMLElement) {}

  public update = () => {
    // apply forces to velocity
    this.velocity.x -= this.velocity.x * dragSequins;
    this.velocity.y = this.velocity.y + gravitySequins;

    // set position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };
}

// add elements to arrays to be drawn
const initBurst = (
  canvas: HTMLCanvasElement,
  button: HTMLElement,
  confetti: Confetto[],
  sequins: Sequin[]
) => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto(canvas, button));
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.push(new Sequin(canvas, button));
  }
};

export const useConfetti = (
  canvasRef: MutableRefObject<HTMLCanvasElement>,
  triggerRef: MutableRefObject<HTMLElement>
): (() => void) => {
  const button = triggerRef.current;
  const canvas = canvasRef.current;
  const ctx = canvasRef.current?.getContext?.("2d");

  if (canvasRef.current) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  //let cx = ctx.canvas.width / 2;
  //let cy = ctx.canvas.height / 2;

  // add Confetto/Sequin objects to arrays to draw them
  const confetti: Confetto[] = [];
  const sequins: Sequin[] = [];

  // helper function to pick a random number within a range
  //getRandomIntRange = (min, max) => Math.random() * (max - min) + min;

  // draws the elements on the canvas
  const render = useCallback(() => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    confetti.forEach((confetto, index) => {
      const width = confetto.dimensions.x * confetto.scale.x;
      const height = confetto.dimensions.y * confetto.scale.y;

      if (ctx) {
        // move canvas to position and rotate
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        // update confetto "physics" values
        confetto.update();

        // get front or back fill color
        ctx.fillStyle =
          confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // draw confetto
        ctx.fillRect(-width / 2, -height / 2, width, height);

        // reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // clear rectangle where button cuts off
        if (confetto.velocity.y < 0) {
          ctx.clearRect(
            canvas.width / 2 - button.offsetWidth / 2,
            canvas.height / 2 + button.offsetHeight / 2,
            button.offsetWidth,
            button.offsetHeight
          );
        }
      }
    });

    sequins.forEach(sequin => {
      if (ctx) {
        // move canvas to position
        ctx.translate(sequin.position.x, sequin.position.y);

        // update sequin "physics" values
        sequin.update();

        // set the color
        ctx.fillStyle = sequin.color;

        // draw sequin
        ctx.beginPath();
        ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
        ctx.fill();

        // reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // clear rectangle where button cuts off
        if (sequin.velocity.y < 0) {
          ctx.clearRect(
            canvas.width / 2 - button.offsetWidth / 2,
            canvas.height / 2 + button.offsetHeight / 2,
            button.offsetWidth,
            button.offsetHeight
          );
        }
      }
    });

    // remove confetti and sequins that fall off the screen
    // must be done in seperate loops to avoid noticeable flickering
    confetti.forEach((confetto, index) => {
      if (canvas?.height && confetto.position.y >= canvas.height)
        confetti.splice(index, 1);
    });
    sequins.forEach((sequin, index) => {
      if (canvas?.height && sequin.position.y >= canvas.height)
        sequins.splice(index, 1);
    });

    !IsServer &&
    window.requestAnimationFrame(render);
  }, [
    button?.offsetHeight,
    button?.offsetWidth,
    canvas?.height,
    canvas?.width,
    confetti,
    ctx,
    sequins,
  ]);

  // cycle through button states when clicked
  const shootConfetti = useCallback(() => {
    initBurst(canvas, button, confetti, sequins);

    // Loading stage
    /*button.classList.add("loading");
      button.classList.remove("ready");
      setTimeout(() => {
        // Completed stage
        button.classList.add("complete");
        button.classList.remove("loading");
        setTimeout(() => {
          initBurst(canvas, button, confetti, sequins);
          setTimeout(() => {
            // Reset button so user can select it again
            button.classList.add("ready");
            button.classList.remove("complete");
          }, 4000);
        }, 320);
      }, 1800);
    }*/
  }, [button, canvas, confetti, sequins]);

  // re-init canvas if the window size changes
  /*const resizeCanvas = useCallback(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //cx = ctx.canvas.width / 2;
    // cy = ctx.canvas.height / 2;
  }, [canvas]);

  // click button on spacebar or return keypress
  const onkeyup = useCallback(
    (e: any) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        shootConfetti();
      }
    },
    [shootConfetti]
  );

  useEffect(() => {
    //window.addEventListener("resize", resizeCanvas);
    //document.addEventListener("keyup", onkeyup);

    return () => {
      //window.removeEventListener("resize", resizeCanvas);
      //document.removeEventListener("keyup", onkeyup);
    };
  }, [onkeyup, resizeCanvas]);*/

  // Set up button text transition timings on page load
  /*const textElements = button.querySelectorAll(".confetti-trigger-text") as HTMLL;
textElements.forEach(element => {
  const characters = element.innerText.split("");
  let characterHTML = "";
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${
      index * 30
    }ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`;
  });
  element.innerHTML = characterHTML;
});*/

  // kick off the render loop
  // initBurst(canvas, button, confetti, sequins);
  render();

  return shootConfetti;
};
