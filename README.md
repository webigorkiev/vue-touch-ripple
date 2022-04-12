# @vuemod/vue-touch-ripple

Ripple directive for vue 3

### Documentation and Demo

[vue-touch-ripple docs](https://webigorkiev.github.io/vue-touch-ripple-docs/)

## Installation

```bash
yarn add @vuemod/vue-touch-ripple
```

### Add directive to your component

```vue
<template>
    <div v-touch-ripple.passive>Test Button</div>
    <div v-touch-ripple:swipe.once.800>Test Button</div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import {touchRipple} from "@vuemod/vue-touch-ripple";

    export default defineComponent({
        name: "App",
        directives: {
            touchRipple
        }
    });

</script>
```

### Effects

* Currently, implemented 2 effects: **click** and **swipe**, see docs. (Default - tap)
* You can set animation duration as modifier, like: v-touch-ripple:swipe.once.**800** (in ms)


### Options

The directive automatically adds styles to the header with the vue-touch-ripple-styles id,
which can be changed in the settings. You can also change the default duration of the effect.
Keep in mind that for the swipe mode you need more long interval.

For use with custom options you need **defineTouchRipple**

```vue
<template>
    <div v-touch-ripple:tap>Test Button</div>
    <div v-touch-ripple:swipe.passive>Test Button</div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import {defineTouchRipple} from "@vuemod/vue-touch-ripple";

    export default defineComponent({
        name: "App",
        directives: {
            touchRipple: defineTouchRipple({duration: 0.5})
        }
    });

</script>
```

### Classes

* v-touch-ripple - Host element
* v-touch-ripple-paint - Ripple element
* v-touch-ripple-paint-extension - Ripple element during animating default
* v-touch-ripple-paint-swipe - Ripple element during animating in swipe mode