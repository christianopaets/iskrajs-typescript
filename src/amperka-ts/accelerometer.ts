/**
 * @description LIS331DLH
 */
export class Accelerometer {
  static readonly G = 9.81;

  private readonly _i2c: I2C;
  private readonly _address: number;

  private _sensitivity: number = 2 / 32767;

  constructor(i2c: I2C, address: number) {
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

  init(opts: any) {
    // Normal power, 50Hz, enable X, Y, Z;
    let config20 = 0x27; /* 00100111 */
    if (opts !== undefined && opts.frequency !== undefined) {
      if (opts.frequency === 100) {
        config20 = config20 | 0x8; /* 00001000 */
      } else if (opts.frequency === 400) {
        config20 = config20 | 0x10; /* 00010000 */
      } else if (opts.frequency === 1000) {
        config20 = config20 | 0x18; /* 00011000 */
      }
    }
    this.writeI2C(0x20, config20);

    let config21 = 0x00;

    if (opts !== undefined && opts.highPassFilter !== undefined) {
      if (opts.highPassFilter === 8) {
        config21 = 0x10; /* 00010000 */
      } else if (opts.highPassFilter === 16) {
        config21 = 0x11; /* 00010001 */
      } else if (opts.highPassFilter === 32) {
        config21 = 0x12; /* 00010010 */
      } else if (opts.highPassFilter === 64) {
        config21 = 0x13; /* 00010011 */
      }
    }
    this.writeI2C(0x21, config21);

    // Maximum sensitivity is 2G
    let config23 = 0x00;
    this._sensitivity = 2 / 32767;
    if (opts !== undefined && opts.maxAccel !== undefined) {
      if (opts.maxAccel === 4) {
        config23 = 0x11; /* 00010001 */
        this._sensitivity = 4 / 32767;
      }
      if (opts.maxAccel === 8) {
        config23 = 0x31; /* 00110001 */
        this._sensitivity = 8 / 32767;
      }
    }
    this.writeI2C(0x23, config23);
  };

  read(units: string) {
    const d = this.readI2C(0x28, 6);
    // reconstruct 16 bit data
    let res = {
      x: d[0] | (d[1] << 8),
      y: d[2] | (d[3] << 8),
      z: d[4] | (d[5] << 8)
    };
    if (res.x >= 32767) {
      res.x -= 65536;
    }
    if (res.y >= 32767) {
      res.y -= 65536;
    }
    if (res.z >= 32767) {
      res.z -= 65536;
    }

    if (units === 'G') {
      res = {
        x: res.x * this._sensitivity,
        y: res.y * this._sensitivity,
        z: res.z * this._sensitivity
      };
    }
    if (units === 'a') {
      res = {
        x: res.x * this._sensitivity * Accelerometer.G,
        y: res.y * this._sensitivity * Accelerometer.G,
        z: res.z * this._sensitivity * Accelerometer.G
      };
    }
    return res;
  };

  whoAmI(): number {
    return this.readI2C(0x0f)[0];
  };

}
