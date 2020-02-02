export class DigitalLineSensor {
  private readonly _pin: Pin;

  constructor(pin: Pin) {

    this._pin = pin;
    pin.mode('input');
    this.startWath();
  }

  startWath(): void {
    setWatch((value) => value.state ? 'black' : 'white', this._pin, {
      repeat: true,
      edge: 'both',
      debounce: '10'
    })
  }

  read(): string {
    return this._pin.read() ? 'black' : 'white';
  }
}
