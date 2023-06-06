import { MutableRefObject, useCallback, useEffect } from "react";

export function useRipple(ref: MutableRefObject<HTMLElement> | null, addClientPosition = true) {
  const handleClick = useCallback((event: MouseEvent) => {
    const button = ref?.current;
    if (button) {
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = addClientPosition ? `${event.clientX - button.offsetLeft - radius}px` : `${button.offsetLeft + (button.clientWidth / 2) - radius}px`;
      circle.style.top = addClientPosition ? `${event.clientY - button.offsetTop - radius}px` : `${button.offsetTop + (button.clientHeight / 2) - radius}px`;
      circle.classList.add("ripple");

      const ripple = button.getElementsByClassName("ripple")[0];
      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
    }
  }, [!ref?.current]);

  useEffect(() => {
    ref?.current && ref.current.addEventListener("click", handleClick);
  }, [handleClick]);
}
