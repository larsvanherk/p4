/* eslint-disable no-console */

const { bluetooth } = process.client
  ? navigator as Navigator & { bluetooth: { requestLEScan: Function, addEventListener: Function } }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : { bluetooth: { requestLEScan: (options: any) => {}, addEventListener: (name: string, handler: Function) => {} } };


let scan: {
  stop: Function
  filters: any
  active: boolean
};

const scanRSSI = ref(-999);

const logDataView = (valueDataView: any) => {
  const textDecoder = new TextDecoder('ascii');
  const asciiString = textDecoder.decode(valueDataView.buffer);
  console.log('  Beacon ASCII Data:', asciiString);
};

bluetooth.addEventListener('advertisementreceived', (event: any) => {
  console.log('### Advertisement received ###');
  console.log('  Device ID: ' + event.device.id);
  console.log('  RSSI: ' + event.rssi);
  event.serviceData.forEach(logDataView);

  scanMonitor.retries = 0;

  scanRSSI.value = event.rssi;
});

const scanMonitor: { retries: number, start: Function, kill: Function, handlerID?: NodeJS.Timer } = {
  retries: 0,
  start: (abort: Function) => {
    scanMonitor.kill();
    
    scanMonitor.retries = 0;
    scanMonitor.handlerID = setInterval(() => {
      console.log('[useBluetooth] Is scan still active:', scan.active);
      scanMonitor.retries++;

      if (scanMonitor.retries >= 200) {
        abort(true);
      }
    }, 200);
  },
  kill: () => {
    if (scanMonitor.handlerID) {
      clearTimeout(scanMonitor.handlerID);
    }
  },
  handlerID: undefined
};

export const useBluetooth = () => {
  const isScanning = ref(false);

  const requestScan = async () => {
    cancelScan();

    try {
      console.log('[useBluetooth] Requesting Bluetooth Scan');
      scan = await bluetooth.requestLEScan({ filters: [{ services: [0xFEAA] }] });
      console.log('[useBluetooth] Scan started...');
      isScanning.value = true;

      scanMonitor.start(cancelScan);
    } catch(error)  {
      console.log('[useBluetooth] Scan init failed:', error);
      isScanning.value = false;
    }
  };

  const cancelScan = (aborted: boolean = false) => {
    console.log(`[useBluetooth] Cancelling scan... (active: ${scan?.active})`);
    if (aborted) console.warn('[useBluetooth] Scan was aborted, because it probably died');
    if (scan) {
      scan.stop();
      scanMonitor.kill();
    }
    scanRSSI.value = -999;
    isScanning.value = false;
    console.log('[useBluetooth] Scan cancelled');
  };

  return {
    isScanning,
    scanRSSI,
    requestScan,
    cancelScan
  };
};
