export class Pot {

  private readonly _pin: Pin;

  constructor (pin: Pin) {
    this._pin = pin;
    this._pin.mode('analog');
  }

  read(): number {
    return analogRead(this._pin);
  }
}
