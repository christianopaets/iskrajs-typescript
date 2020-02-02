interface Options {
  white?: number;
  black?: number;
}

export class AnalogLineSensor {

  private readonly _pin: Pin;
  private _min: number = 0;
  private _max: number = 1;

  constructor(pin: Pin) {
    this._pin = pin;
    this._pin.mode('analog');
  }

  read(units: string) {
    if (units === 'mV') {
      return analogRead(this._pin) * E.getAnalogVRef() * 1000;
    } else if (units === 'V') {
      return analogRead(this._pin) * E.getAnalogVRef();
    } else if (units === 'u') {
      return analogRead(this._pin);
    } else {
      var calibratedValue = analogRead(this._pin);
      if (this._min !== 0 || this._max !== 1) {
        calibratedValue = E.clip(
          (calibratedValue - this._min) / (this._max - this._min),
          0,
          1
        );
      }
      return calibratedValue;
    }
  };

  calibrate(opts: Options) {
    if (opts && opts.white) {
      this._min = opts.white ? analogRead(this._pin) : opts.white;
    }
    if (opts && opts.black) {
      this._max = opts.black ? analogRead(this._pin) : opts.black;
    }
  };
}
