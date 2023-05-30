<script setup lang="ts">
const pup = ref<{
  playbackRate: number
}>({ playbackRate: 0 });

const speed = computed({
  get() {
    return pup.value.playbackRate;
  },
  set(rate) {
    pup.value.playbackRate = rate;
  }
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
      min="0"
      max="1">
  </main>
</template>
