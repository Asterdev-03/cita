class MyWorkletProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    let sum = 0;
    for (let i = 0; i < input[0].length; i++) {
      sum += Math.abs(input[0][i]);
    }
    const average = sum / input[0].length;
    this.port.postMessage({ inputVolume: average });
    return true;
  }
}
registerProcessor("my-worklet-processor", MyWorkletProcessor);
