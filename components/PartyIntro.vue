<script setup lang="ts">
const showP4 = ref(false);

onMounted(() => {
  setTimeout(() => {
    showP4.value = true;
  }, 1000);
});
</script>

<template>
  <main
    class="flex flex-col justify-center items-center gap-4 w-screen h-screen">
    <h1 class="text-center font-sans text-5xl">
      <span class="italic">WELCOME, PLEASE APPROACH</span>
    </h1>

    <img
      class="p4__banner w-8/12"
      :class="{
        'p4__banner--visible': showP4
      }"
      src="/img/p4.png"
      alt="P4">
  </main>
</template>

<style lang="scss">
.p4 {
  &__banner {
    transition: all 3s ease-out;
    transform: scale(0.7);
    opacity: 0;

    &--visible {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>