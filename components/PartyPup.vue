<script setup lang="ts">
import party from 'party-js';
import { DynamicSourceType } from 'party-js/lib/systems/sources';

import { TransitionPresets, useTransition } from '@vueuse/core';

const {
  isScanning,
  scanRSSI,
  requestScan,
  cancelScan
} = useBluetooth();

/**
 * Pup Logic
 */
const pup = ref<{
  playbackRate: number
  play: Function
  pause: Function
}>({ playbackRate: 1, play: () => {}, pause: () => {} });

const speed = computed({
  get() {
    return pup.value.playbackRate;
  },
  set(rate) {
    if (rate <= 0.7) {
      pup.value.playbackRate = 0.7;
      pup.value.pause();
    } else {
      pup.value.playbackRate = rate;
      pup.value.play();
    }
  }
});

const speedProxy = ref(0);
const easedSpeed = useTransition(speedProxy, {
  duration: 2000,
  transition: TransitionPresets.easeOutSine,
});

/**
 * Party detection and event initialisation
 */
const isPartying = computed(() => scanRSSI.value >= -60);
watch(isPartying, () => {
  if (isPartying.value) {
    speedProxy.value = 2;
    initCannons();
    theme.play();
  } else {
    speedProxy.value = 0;
    killCannons();
    theme.pause();
    theme.currentTime = 0;
  }
});
watch(easedSpeed, value => speed.value = value);

/**
 * Confetti cannon logic
 */
let cannonHandlers: NodeJS.Timer[] = [];

function initCannons() {
  killCannons();

  Array.from(document.querySelectorAll('.p4__party-emitter'))
    .forEach(emitter => {
      cannonHandlers.push(
        setInterval(() => {
          party.confetti(emitter as DynamicSourceType, {
            count: 50,
            size: party.variation.range(1, 3),
            spread: party.variation.range(10, 20),
            speed: party.variation.range(1000, 1500)
          });
        }, 2000)
      );
    });
}

function killCannons() {
  cannonHandlers.forEach(handler => clearInterval(handler));
  cannonHandlers = [];
}

/**
 * General initialisation
 */
let theme: HTMLAudioElement;

onMounted(() => {
  speed.value = 0;

  theme = new Audio('/audio/theme.mp3');
});
</script>

<template>
  <main class="flex flex-col gap-20 h-screen w-screen justify-center items-center">
    <div
      class="p4__party-overlay absolute top-0 left-0 w-screen h-screen flex flex-col justify-end"
      :class="{
        'p4__party-overlay--enabled': isPartying,
        'p4__party-overlay--disabled': scanRSSI === -999
      }">
      <div class="flex flex-row justify-around content-center">
        <div class="p4__party-emitter h-0" />
        <div class="p4__party-emitter h-0" />
      </div>
    </div>

    <h1 class="font-sans text-8xl">
      <span
        v-if="!isPartying"
        class="italic">
        BRING THE PARTY
      </span>
      <span v-else>🎉🥳 <span class="italic">NICE</span> 🥳🎉</span>
    </h1>

    <video
      ref="pup"
      class="w-70 h-70"
      autoplay
      loop>
      <source
        src="/img/pup.webm"
        type="video/webm">
    </video>

    <div class="absolute right-0 bottom-0 flex flex-col gap-3 px-5 py-3">
      <div class="text-center">
        <small>RSSI: {{ scanRSSI }}</small>
      </div>
      <div class="flex gap-5">
        <button
          v-if="!isScanning"
          class="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="requestScan">
          Request Scan
        </button>
        <button
          v-else
          class="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="() => cancelScan()">
          Cancel Scan
        </button>
        <button
          class="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="pup.play()">
          Force play
        </button>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.p4 {
  &__party-overlay {
    transition: opacity 2.5s ease;
    opacity: 0;

    animation-duration: .5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-name: party;

    &--enabled {
      opacity: .5;
    }
    &--disabled {
      display: none;
    }
  }
}

@keyframes party {
  0%, 100% {
    background: #7272E9;
  }
  25% {
    background: #51CFDB;
  }
  50% {
    background: #3AD4AC;
  }
  75% {
    background: #E04351;
  }
}
</style>
