<template>
    <div class="wrapper">
        <div class="row">
            <div class="button" v-touch-ripple="getIsFireEffect">Default</div>
            <div class="button green" v-touch-ripple:tap="isFireEffect">Green</div>
            <div class="button orange" v-touch-ripple:tap="isFireEffect">Orange</div>
            <div class="button yellow" v-touch-ripple:tap="isFireEffect">Yellow</div>
            <div class="button purple" v-touch-ripple:tap.200="isFireEffect">Purple 200ms</div>
        </div>
        <div class="row">
            <div class="button large" v-touch-ripple:swipe.800="isFireEffect">Swipe 800ms</div>
        </div>
        <div class="row">
            <div class="button large" v-touch-ripple:swipe.once="isFireEffect">Swipe once</div>
        </div>
        <div class="row">
            <label>On or off</label>
            <input type="checkbox" v-model="isFireEffect" style="transform: scale(2)">
        </div>
    </div>

</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import {touchRipple} from "../../src";

    export default defineComponent({
        name: "App",
        directives: {
            touchRipple
        },
        data() {
            return {
                isFireEffect: true
            }
        },
        methods: {
            getIsFireEffect() {
                return this.isFireEffect
            }
        }
    });
</script>

<style>
    body {
        background-color: #eff3f8;
    }
    label {
        margin-right: 1em;
    }
    .wrapper {
        width: 320px;
        margin: 0 auto;
    }
    .row {
        display: flex;
        justify-content: center;
        flex-flow: row wrap;
    }
    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 1em;
        margin-bottom: 1em;
        cursor: pointer;
        width: 75px;
        height: 75px;
        color: white;
        border-radius: 12px;
        background-color: #3B82F6;
    }
    .large {
        width: 300px;
    }
    .button.purple {
        color: black;
        background-color: white;
        width: calc(150px + 1em);
    }
    .button.purple .v-touch-ripple-paint {
        background: rgba(156, 39, 176, 0.3);
    }
    .button.green {
        color: black;
        background-color: white;
    }
    .button.green .v-touch-ripple-paint {
        background: rgba(29, 167, 80, 0.5)
    }
    .button.orange {

    }
    .button.orange .v-touch-ripple-paint {
        background: rgba(238, 193, 55, 0.7)
    }
    .button.yellow {
        color: black;
        background-color: white;
    }
    .button.yellow .v-touch-ripple-paint {
        background: rgba(255, 255, 0, 0.5)
    }
</style>