/**
 * @description LPS331
 */
export class Barometer {
  private readonly _i2c: I2C;
  private readonly _address: number;

  constructor(i2c: I2C, address: number = 0x5c) {
    this._i2c = i2c;
    this._address = address;
  }

  writeI2C(reg: number, data: any) {
    this._i2c.writeTo(this._address, [reg, data]);
  };

  readI2C(reg: number, count: number = 1): Uint8Array {
    this._i2c.writeTo(this._address, reg | 0x80);
    return this._i2c.readFrom(this._address, count);
  };

  init() {
    this.writeI2C(0x20, 0xe0);
  };

  temperature(units: string): number {
    const data = this.readI2C(0x2b, 2);
    let temp = data[0] | (data[1] << 8);
    if (temp >= 32767) {
      temp -= 0xffff;
    }
    if (units === 'C') {
      temp = 42.5 + temp / 480;
    }
    return temp;
  };

  read(units: string): number {
    const data = this.readI2C(0x28, 3);
    let baro = (data[1] << 8) | (data[2] << 16) || data[0];
    if (baro > 2147483647) {
      baro -= 0xffffffff;
    }
    switch (units) {
      case 'mmHg':
        baro = baro / 5460.8691;
        break;
      case 'Pa':
        baro = baro / 4096;
        break;
    }
    return baro;
  };

  whoAmI(): number {
    return this.readI2C(0x0f)[0];
  };
}
