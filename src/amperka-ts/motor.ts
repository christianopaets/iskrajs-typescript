export interface IMotorOptions {
  pwmPin: Pin;
  phasePin: Pin;
  freq?: number;
}

export class Motor {

  private readonly _pwmPin: Pin;
  private readonly _phasePin: Pin;
  private readonly _defaultM1: IMotorOptions = {
    pwmPin: P5,
    phasePin: P4,
    freq: 100
  };
  private readonly _defaultM2: IMotorOptions = {
    pwmPin: P6,
    phasePin: P7,
    freq: 100
  };

  get M1(): IMotorOptions {
    return this._defaultM1;
  }

  get M2(): IMotorOptions {
    return this._defaultM2;
  }

  constructor(options: IMotorOptions) {
    this._pwmPin = options.pwmPin;
    this._phasePin = options.phasePin;
    this._init(options);
  }

  private _init(options: IMotorOptions): void {
    this._pwmPin.mode('output');
    this._phasePin.mode('output');
    if (options.freq) {
      analogWrite(this._pwmPin, 0, {freq: options.freq});
    }
  }

  write(u: number) {
    this._phasePin.write(u > 0);
    analogWrite(this._pwmPin, E.clip(Math.abs(u), 0, 1), {});
  };
}
