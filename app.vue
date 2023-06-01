<script setup lang="ts">
const {
  isScanning,
  scanRSSI,
  requestScan,
  cancelScan
} = useBluetooth();

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

const isPartying = computed(() => scanRSSI.value >= -60);

watch(isPartying, () => {
  speed.value = isPartying.value ? 2 : 0;
});

onMounted(() => {
  speed.value = 0;
});
</script>

<template>
  <main class="flex flex-col gap-10 h-screen w-screen justify-center items-center">
    <video
      ref="pup"
      class="w-70 h-70"
      autoplay
      loop>
      <source
        src="/img/pup.webm"
        type="video/webm">
    </video>

    <input
      v-model="speed"
      type="range"
      step="0.01"
      min="0.7"
      max="2">

    <pre>{{ { scanRSSI, isPartying } }}</pre>

    <div class="flex flex-row gap-5">
      <button
        v-if="!isScanning"
        @click="requestScan">
        Request Scan
      </button>
      <button
        v-else
        @click="() => cancelScan()">
        Cancel Scan
      </button>
      <button @click="pup.play()">
        Force play
      </button>
    </div>
  </main>
</template>
