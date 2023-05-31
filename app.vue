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

const logDataView = (labelOfDataSource: any, key: any, valueDataView: any) => {
  const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
    return b.toString(16).padStart(2, '0');
  }).join(' ');
  const textDecoder = new TextDecoder('ascii');
  const asciiString = textDecoder.decode(valueDataView.buffer);
  console.log(`  ${labelOfDataSource} Data: ` + key +
      '\n    (Hex) ' + hexString +
      '\n    (ASCII) ' + asciiString);
};

const requestScan = () => {
  const { bluetooth } = navigator as Navigator & { bluetooth: { requestLEScan: Function, addEventListener: Function } };

  try {
    console.log('Requesting Bluetooth Scan');
    const scan = bluetooth.requestLEScan({ filters: [{ services: [0xFEAA] }] });

    console.log('Scan started with:');
    console.log(' acceptAllAdvertisements: ' + scan.acceptAllAdvertisements);
    console.log(' active: ' + scan.active);
    console.log(' keepRepeatedDevices: ' + scan.keepRepeatedDevices);
    console.log(' filters: ' + JSON.stringify(scan.filters));

    bluetooth.addEventListener('advertisementreceived', (event: any) => {
      console.log('Advertisement received.');
      console.log('  Device Name: ' + event.device.name);
      console.log('  Device ID: ' + event.device.id);
      console.log('  RSSI: ' + event.rssi);
      console.log('  TX Power: ' + event.txPower);
      console.log('  UUIDs: ' + event.uuids);
      event.manufacturerData.forEach((valueDataView: any, key: any) => {
        logDataView('Manufacturer', key, valueDataView);
      });
      event.serviceData.forEach((valueDataView: any, key: any) => {
        logDataView('Service', key, valueDataView);
      });
    });

    setTimeout(() => {
      console.log('Stopping scan...');
      scan.stop();
      console.log('Stopped.  scan.active = ' + scan.active);
    }, 10000);
  } catch(error)  {
    console.log('Argh! ' + error);
  }
};
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

    <button @click="requestScan">
      Request Scan
    </button>
  </main>
</template>
