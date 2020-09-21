export interface RtcTimeObject {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export class RTC {

  private readonly _i2c: I2C;

  private readonly _address: number = 0x68;

  private _time: Date;

  constructor(i2c: I2C) {
    this._i2c = i2c;
    this.start();
  }

  private get year(): number {
    return this._time.getFullYear();
  }

  private get month(): number {
    return this._time.getMonth() + 1;
  }

  private get date(): number {
    return this._time.getDate();
  }

  private get hours(): number {
    return this._time.getHours();
  }

  private get minutes(): number {
    return this._time.getMinutes();
  }

  private get seconds(): number {
    return this._time.getSeconds();
  }

  write(reg, data): void {
    this._i2c.writeTo(this._address, [reg, data]);
  }

  read(reg, count: number = 1): Uint8Array {
    this._i2c.writeTo(this._address, reg);
    return this._i2c.readFrom(this._address, count);
  }

  setTime(time: Date | string | number | RtcTimeObject = getTime()): void {
    if (time instanceof Date) {
      this._time = time;
    } else if (time instanceof Object) {
      this._time = new Date(
        time.year,
        time.month - 1,
        time.day,
        time.hour,
        time.minute,
        time.second
      );
    } else if (typeof time === 'number') {
      this._time = new Date(time * 1000);
    } else if (typeof time === 'string') {
      this._time = new Date(Date.parse(time));
    } else {
      this._time = new Date(getTime() * 1000);
    }

    const halt = this.read(0x00, 1)[0] >> 7;
    this.write(0x00, [
      this._decToBcd(this._time.getSeconds()) | (halt << 7),
      this._decToBcd(this._time.getMinutes()),
      this._decToBcd(this._time.getHours()),
      this._decToBcd(this._time.getDay() + 1),
      this._decToBcd(this._time.getDate()),
      this._decToBcd(this._time.getMonth() + 1),
      this._decToBcd(this._time.getFullYear() - 2000)
    ]);
  }

  getTime(unit: 'date'): Date;
  getTime(unit: 'iso'): string;
  getTime(unit: 'unixtime'): number;
  getTime(unit: 'date' | 'iso' | 'unixtime'): Date | string | number {
    const time = this.read(0x00, 7);
    this._time = new Date(
      this._bcdToDec(time[6]) + 2000,
      this._bcdToDec(time[5]) - 1,
      this._bcdToDec(time[4]),
      this._bcdToDec(time[2] & 0x3f),
      this._bcdToDec(time[1]),
      this._bcdToDec(time[0] & 0x7f)
    );

    switch (unit) {
      case 'date': {
        return this._time;
      }
      case 'unixtime':
        return  Math.ceil(this._time.getTime() / 1000);
      case 'iso':
        return this._dateToIso();
      default:
        return this._time;
    }
  }

  start(): void {
    const byte = this.read(0x00, 1)[0];
    if (byte >> 7) {
      this.write(0x00, byte ^ 0x80);
    }
  }

  stop(): void {
    const byte = this.read(0x00, 1)[0];
    if (byte >> 7 === 0) {
      this.write(0x00, byte ^ 0x80);
    }
  }

  protected _decToBcd(val: number): number {
    return Math.floor(val / 10) * 16 + (val % 10);
  }

  protected _bcdToDec(val: number): number {
    return Math.floor(val / 16) * 10 + (val % 16);
  }

  protected _leadZero(val: number): string {
    return `${val < 10 ? '0' : ''}${val}`;
  }

  protected _dateToIso(): string {
    const date = `${this.year}-${this._leadZero(this.month)}-${this._leadZero(this.date)}`;
    const time = `${this._leadZero(this.hours)}:${this._leadZero(this.minutes)}:${this._leadZero(this.seconds)}`;
    return `${date}T${this._leadZero(this.hours)}:${time}`;
  }
}
