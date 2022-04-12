import type {Directive} from "vue";

export interface RippleOptions {
    styleId?: string
    duration?: number
}
interface HTMLElementTouch extends HTMLElement {
    _vueTouchRipple?: {
        effect: string,
        diameter: number,
        shift: number[]
    }
}
export const defineTouchRipple = (options?:RippleOptions) => {
    const opts: Required<RippleOptions> = Object.assign({
        styleId: "vue-touch-ripple-styles",
        duration: "0.4"
    }, options || {});
    const isTouchScreenDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints;
    const getCoords = (event: Event) => event.type.indexOf('mouse') !== -1
        ? [(event as MouseEvent).clientX, (event as MouseEvent).clientY]
        : [(event as TouchEvent).touches[0].clientX, (event as TouchEvent).touches[0].clientY];
    const onAnimationEnd = (event: Event) => {
        const el = event.target as HTMLElementTouch;
        el.classList.remove("v-touch-ripple-paint-extension");
        el.classList.remove("v-touch-ripple-paint-swipe");
    };
    const isSheet = () => {
        return !!document.getElementById(opts.styleId);
    };
    const createSheet = () => {
        if(isSheet()) {
            return;
        }
        const sheet = document.createElement("style");
        sheet.id = opts.styleId;
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
            .v-touch-ripple-paint-extension {animation: touch-ripple-extension ${opts.duration}s linear;}
            .v-touch-ripple-paint-swipe {animation: touch-ripple-swipe ${opts.duration*1.5}s linear;}
        `;
        document.head.prepend(sheet);
    };
    const removeSheet = () => {
        const sheet = document.getElementById(opts.styleId);
        sheet && document.head.removeChild(sheet);
    };
    const mounted = (el: HTMLElementTouch) => {
        el.classList.add("v-touch-ripple");
        const paint = document.createElement("span");
        paint.classList.add("v-touch-ripple-paint");
        el.appendChild(paint);
        paint.addEventListener('animationend', onAnimationEnd);
    };
    const getPaint = (el: HTMLElementTouch) => {
        return el.getElementsByClassName("v-touch-ripple-paint").item(0) as HTMLElementTouch || null;
    };
    const unmounted = (el: HTMLElementTouch) => {
        el.classList.remove("v-touch-ripple");
        const paint = getPaint(el);
        paint && paint.removeEventListener('animationend', onAnimationEnd);
        paint && paint.remove();
    };
    const onMouseDown = (event: Event) => {
        const el = event.currentTarget as HTMLElementTouch;
        const paint = getPaint(el);

        if(!paint) {
            return;
        }
        paint.classList.remove(el._vueTouchRipple!.effect);
        const box = el.getBoundingClientRect();
        const diameter = Math.max(box.height,box.width);
        paint.style.height = `${diameter}px`;
        paint.style.width = `${diameter}px`;
        const shift = [box.left, box.top];
        el._vueTouchRipple!.diameter = diameter;
        el._vueTouchRipple!.shift = shift;

        const coords = getCoords(event);
        paint.style.left = `${coords[0] - shift[0] - diameter/2}px`;
        paint.style.top = `${coords[1] - shift[1] - diameter/2}px`;
        paint.classList.add(el._vueTouchRipple!.effect);
    };
    const touchmove = (event: Event) => {
        const el = event.currentTarget as HTMLElementTouch;
        if(el._vueTouchRipple!.effect !== "v-touch-ripple-paint-swipe") {
            return;
        }
        const paint = getPaint(el);

        if(!paint) {
            return;
        }
        const coords = getCoords(event);
        const diameter = el._vueTouchRipple!.diameter;
        const shift = el._vueTouchRipple!.shift;
        paint.style.left = `${coords[0] - shift[0] - diameter/2}px`;
        paint.style.top = `${coords[1] - shift[1] - diameter/2}px`;
    };

    return {
        mounted(el: HTMLElementTouch, binding) {
            const isFirstDirective = !("_vueTouchRipple" in el);
            createSheet();
            mounted(el);
            if(isFirstDirective) {
                const modifiers = binding.modifiers;
                el._vueTouchRipple = {
                    effect: modifiers.swipe ? "v-touch-ripple-paint-swipe" : "v-touch-ripple-paint-extension",
                    diameter: 0,
                    shift: [0, 0]
                };
                el.addEventListener('touchstart', onMouseDown, {passive: true});
                el.addEventListener('touchmove', touchmove, {passive: true});

                if(!isTouchScreenDevice()) {
                    el.addEventListener('mousedown', onMouseDown);
                    el.addEventListener('mousemove', touchmove, {passive: true});
                }
            }
        },
        unmounted(el: HTMLElementTouch) {
            removeSheet();
            unmounted(el);
            el.removeEventListener('touchstart', onMouseDown);
            el.removeEventListener('touchmove', touchmove);

            if(!isTouchScreenDevice()) {
                el.removeEventListener('mousedown', onMouseDown);
                el.removeEventListener('mousemove', touchmove);
            }
        }
    } as Directive;
};
export const touchRipple: Directive = defineTouchRipple();