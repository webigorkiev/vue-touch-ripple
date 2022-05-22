import { Directive } from 'vue';

interface RippleOptions {
    duration?: number;
}
declare const defineTouchRipple: (options?: RippleOptions | undefined) => Directive<any, any>;
declare const touchRipple: Directive;

export { RippleOptions, defineTouchRipple, touchRipple };
