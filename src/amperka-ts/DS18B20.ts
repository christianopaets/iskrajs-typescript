export class DS18B20 {
  private readonly _oneWire: OneWire;

  constructor(device: OneWire) {
    this._oneWire = device;
  }

  get(device: OneWire): number {
    // Get temp
    this._oneWire.reset();
    this._oneWire.select(device);
    this._oneWire.write(0x44, false);

    // Read register
    this._oneWire.reset();
    this._oneWire.select(device);
    this._oneWire.write(0xbe, false);
    const regs = this._oneWire.read(9);

    // Convert
    let temp = regs[0] | (regs[1] << 8);
    if (temp > 32767) {
      temp -= 65536;
    }
    temp = temp / 16;
    return temp;
  }
}
