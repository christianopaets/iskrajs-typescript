export class Buzzer {
  private _pin: Pin;
  private _on: boolean = false;
  private _frequency: number = 2000;

  private _beepTimeoutID: NodeJS.Timeout | null = null;
  private _beepOnTime: number = 0;
  private _beepOffTime: number = 0;

  constructor(pin: Pin) {
    this._pin = pin;
    this._pin.mode('output');
  }

  toggle(state?: boolean): void {
    if (typeof state === undefined) {
      return this.toggle(!this._on);
    }

    this._clearBeep();
    this._beepOnTime = 0;
    this._beepOffTime = 0;
    this._on = !!arguments[0];
    this._update();
  }

  turnOn(): void {
    this.toggle(true);
  }

  turnOff(): void {
    this.toggle(false);
  }

  isOn(): boolean {
    return this._on;
  }

  private _clearBeep(): void {
    if (this._beepTimeoutID) {
      clearTimeout(this._beepTimeoutID);
      this._beepTimeoutID = null;
    }
  }

  private _beepOn(): void {
    this._on = true;
    this._update();
    this._beepTimeoutID = setTimeout(
      this._beepOff.bind(this),
      this._beepOnTime * 1000
    );
  }

  private _beepOff(): void {
    this._on = false;
    this._update();

    if (this._beepOffTime) {
      this._beepTimeoutID = setTimeout(
        this._beepOn.bind(this),
        this._beepOffTime * 1000
      );
    } else {
      this._beepTimeoutID = null;
    }
  }

  beep(onTime: number, offTime: number): void {
    if (
      this._beepOnTime === onTime &&
      this._beepOffTime &&
      this._beepOffTime === offTime
    ) {
      return;
    }

    this._beepOnTime = onTime;
    this._beepOffTime = offTime;
    this._clearBeep();

    if (this._on) {
      this._beepOff();
    } else {
      this._beepOn();
    }
  }

  frequency(frequency?: number): void {
		if (!frequency) {
			return;
		}
		this._frequency = Math.min(Math.max(frequency, 0.0), 20000.0);
    this._update();
  }

  private _update() {
    analogWrite(this._pin, this._on ? 0.5 : 0, { freq: this._frequency });
  }
}
