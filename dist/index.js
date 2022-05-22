'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const defaultListenerOptions = {
  once: false,
  passive: false,
  capture: false
};
const styleId = "__vue-touch-ripple-styles";
const defineTouchRipple = (options) => {
  const opts = Object.assign({
    duration: "400"
  }, options || {});
  const isTouchScreenDevice = () => "ontouchstart" in window || navigator.maxTouchPoints;
  const bindingValue = (value) => {
    if (typeof value === "undefined") {
      return true;
    }
    if (typeof value === "function") {
      return !!value();
    }
    const ref = value.value || value;
    return !!ref;
  };
  const getCoords = (event) => event.type.indexOf("mouse") !== -1 ? [event.clientX, event.clientY] : [event.touches[0].clientX, event.touches[0].clientY];
  const onAnimationEnd = (event) => {
    const el = event.target;
    el.classList.remove("v-touch-ripple-paint-extension");
    el.classList.remove("v-touch-ripple-paint-swipe");
  };
  const isSheet = () => {
    return !!document.getElementById(styleId);
  };
  const getPaint = (el) => {
    return el.getElementsByClassName("v-touch-ripple-paint").item(0) || null;
  };
  const onMouseDown = (event) => {
    const el = event.currentTarget;
    const paint = getPaint(el);
    if (!paint || !bindingValue(el._vueTouchRipple?.value)) {
      return;
    }
    paint.classList.remove(el._vueTouchRipple.effect);
    const box = el.getBoundingClientRect();
    const diameter = Math.max(box.height, box.width);
    paint.style.height = `${diameter}px`;
    paint.style.width = `${diameter}px`;
    const shift = [box.left, box.top];
    el._vueTouchRipple.diameter = diameter;
    el._vueTouchRipple.shift = shift;
    const coords = getCoords(event);
    paint.style.left = `${coords[0] - shift[0] - diameter / 2}px`;
    paint.style.top = `${coords[1] - shift[1] - diameter / 2}px`;
    paint.classList.add(el._vueTouchRipple.effect);
  };
  const touchmove = (event) => {
    const el = event.currentTarget;
    if (el._vueTouchRipple.effect !== "v-touch-ripple-paint-swipe") {
      return;
    }
    const paint = getPaint(el);
    if (!paint) {
      return;
    }
    const coords = getCoords(event);
    const diameter = el._vueTouchRipple.diameter;
    const shift = el._vueTouchRipple.shift;
    paint.style.left = `${coords[0] - shift[0] - diameter / 2}px`;
    paint.style.top = `${coords[1] - shift[1] - diameter / 2}px`;
  };
  const createSheet = () => {
    if (isSheet()) {
      return;
    }
    const sheet = document.createElement("style");
    sheet.id = styleId;
    sheet.innerHTML = `
            @keyframes touch-ripple-extension {100% {opacity: 0;transform: scale(2.5);}}
            @keyframes touch-ripple-swipe {
                50% {opacity: 0;transform: scale(2.5); 
                100% {opacity: 1;transform: scale(0);}}
            }
            .v-touch-ripple {
                overflow: hidden;
                position: relative;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                -webkit-tap-highlight-color: transparent;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            }
            .v-touch-ripple-paint {display: block;position: absolute;background: rgba(255, 255, 255, 0.5);
            border-radius: 100%;transform: scale(0);pointer-events: none;}
            .v-touch-ripple-paint-extension {animation-name: touch-ripple-extension;animation-timing-function: linear;}
            .v-touch-ripple-paint-swipe {animation-name: touch-ripple-swipe;animation-timing-function: linear;}
        `;
    document.head.prepend(sheet);
  };
  const mounted = (el, duration) => {
    el.classList.add("v-touch-ripple");
    const paint = document.createElement("span");
    paint.classList.add("v-touch-ripple-paint");
    duration && (paint.style.animationDuration = `${duration}ms`);
    el.appendChild(paint);
    paint.addEventListener("animationend", onAnimationEnd);
  };
  const unmounted = (el) => {
    el.classList.remove("v-touch-ripple");
    const paint = getPaint(el);
    paint && paint.removeEventListener("animationend", onAnimationEnd);
    paint && paint.remove();
  };
  return {
    mounted(el, binding) {
      const isFirstDirective = !("_vueTouchRipple" in el);
      const listenerOpts = Object.assign({}, defaultListenerOptions);
      const modifiers = binding.modifiers;
      const duration = opts.duration;
      const modifierDuration = Object.keys(modifiers).find((key) => /^\d+$/.test(key));
      createSheet();
      mounted(el, modifierDuration ? parseInt(modifierDuration) : duration);
      if (isFirstDirective) {
        listenerOpts.capture = modifiers.capture || false;
        listenerOpts.once = modifiers.once || false;
        listenerOpts.passive = modifiers.passive || false;
        const arg = binding.arg;
        el._vueTouchRipple = {
          effect: modifiers.swipe || arg === "swipe" ? "v-touch-ripple-paint-swipe" : "v-touch-ripple-paint-extension",
          diameter: 0,
          shift: [0, 0],
          value: binding.value
        };
        el.addEventListener("touchstart", onMouseDown, listenerOpts);
        el.addEventListener("touchmove", touchmove, listenerOpts);
        if (!isTouchScreenDevice()) {
          el.addEventListener("mousedown", onMouseDown);
          el.addEventListener("mousemove", touchmove, listenerOpts);
        }
      }
    },
    unmounted(el) {
      unmounted(el);
      el.removeEventListener("touchstart", onMouseDown);
      el.removeEventListener("touchmove", touchmove);
      if (!isTouchScreenDevice()) {
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mousemove", touchmove);
      }
    },
    updated(el, binding) {
      el._vueTouchRipple.value = binding.value;
    }
  };
};
const touchRipple = defineTouchRipple();

exports.defineTouchRipple = defineTouchRipple;
exports.touchRipple = touchRipple;
