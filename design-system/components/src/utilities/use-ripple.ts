import { MutableRefObject, useCallback, useEffect } from "react";

export function useRipple(ref: MutableRefObject<HTMLElement> | null) {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const button = ref?.current;

      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.classList.add("ripple");

      const ripple = button.getElementsByClassName("ripple")[0];
      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
    },
    [ref]
  );

  useEffect(() => {
    ref?.current && ref.current.addEventListener("click", handleClick);
  }, [handleClick, ref]);
}
