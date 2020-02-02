export class Led {
  private readonly _pin: Pin;
  private _on: boolean = false;
  private _brightness: number = 1.0;

  private _blinkTimeoutID: NodeJS.Timeout | null = null;
  private _blinkOnTime: number = 0;
  private _blinkOffTime: number = 0;

  constructor(pin: Pin) {
    this._pin = pin;
    this._pin.mode('output');
  }

  toggle(state?: boolean): void {
    if (!state) {
      this.toggle(!this._on);
      return;
    }

    this._clearBlink();
    this._blinkOnTime = 0;
    this._blinkOffTime = 0;
    this._on = state;
    this._update();
  }

  turnOn(): void {
    this.toggle(true);
  }

  turnOff(): void {
    this.toggle(false);
  }

  isOn(): void {
    this._on;
  }

  _clearBlink(): void {
    if (this._blinkTimeoutID) {
      clearTimeout(this._blinkTimeoutID);
      this._blinkTimeoutID = null;
    }
  }

  _blinkOn(): void {
    this._on = true;
    this._update();
    this._blinkTimeoutID = setTimeout(
      this._blinkOff.bind(this),
      this._blinkOnTime * 1000
    );
  }

  _blinkOff(): void {
    this._on = false;
    this._update();

    if (this._blinkOffTime) {
      this._blinkTimeoutID = setTimeout(
        this._blinkOn.bind(this),
        this._blinkOffTime * 1000
      );
    } else {
      this._blinkTimeoutID = null;
    }
  }

  blink(onTime: number, offTime: number): void {
    if (
      this._blinkOnTime === onTime &&
      this._blinkOffTime &&
      this._blinkOffTime === offTime
    ) {
      return;
    }

    this._blinkOnTime = onTime;
    this._blinkOffTime = offTime;
    this._clearBlink();

    if (this._on) {
      this._blinkOff();
    } else {
      this._blinkOn();
    }
  }

  brightness(value?: number): void {
    if (!value) {
      return;
    }

    value = Math.max(0.0, Math.min(value, 1.0));
    this._brightness = value;
    this._update();
  }

  _update(): void {
    var b = this._brightness;
    if (b > 0 && b < 1.0) {
      analogWrite(this._pin, this._on ? b * b * b : 0, {freq: 100});
    } else {
      digitalWrite(this._pin, this._on);
    }
  }


}
