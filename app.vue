<script setup lang="ts">
import LandingPage from './components/LandingPage.vue';
import PartyIntro from './components/PartyIntro.vue';
import PartyPup from './components/PartyPup.vue';

const activePage = shallowRef(LandingPage);

function launchApp() {
  activePage.value = PartyIntro;

  setTimeout(() => {
    activePage.value = PartyPup;
  }, 7000);
}
</script>

<template>
  <transition
    name="slide-fade"
    mode="out-in">
    <component
      :is="activePage"
      @launch="launchApp" />
  </transition>
</template>

<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>