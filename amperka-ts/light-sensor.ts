import { TLightSensorConstants } from './../enums/light-sensor-constants.enum';
export class LightSensor {
  private _pin: Pin;

  constructor(pin: Pin) {
    this._pin = pin;
    this._pin.mode('analog');
  }

  read(units: string) {
    var val = analogRead(this._pin);
    if (typeof units === 'undefined') {
      return val;
    }

    switch (units) {
      case 'V':
        return val * E.getAnalogVRef();
      case 'mV':
        return 1000 * val * E.getAnalogVRef();
      case 'lx':
        var resistance = TLightSensorConstants.R_DIVIDER / (1.0 / val - 1);
        return (
          10.0 *
          Math.pow(
            TLightSensorConstants.LDR_10LUX / resistance,
            1.0 / TLightSensorConstants.LDR_GAMMA
          )
        );
    }
  }
}
