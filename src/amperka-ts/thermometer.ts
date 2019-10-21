export class Thermometer {
  private readonly _pin: Pin;

  constructor(pin: Pin) {
    this._pin = pin;
    this._pin.mode('analog');
  }

  read(units: string) {
    var val = analogRead(this._pin);
    if (typeof units === 'undefined') {
      return val;
    }

    var v = val * E.getAnalogVRef();

    switch (units) {
      case 'V':
        return v;
      case 'mV':
        return 1000 * v;
      case 'C':
        return v * 100 - 50;
    }
  };
}
