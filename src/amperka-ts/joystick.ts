export interface IJoystickData {
  x: number;
  y: number;
  button: number;
}

export class Joystick {
    private readonly _pX: Pin;
    private readonly _pY: Pin;
    private readonly _pButton: Pin;

    constructor (pX: Pin, pY: Pin, pButton: Pin) {
      this._pX = pX;
      this._pY = pY;
      this._pButton = pButton;
    }

    get(): IJoystickData {
      return {
        x: analogRead(this._pX),
        y: analogRead(this._pY),
        button: digitalRead(this._pButton)
      }
    }
}
