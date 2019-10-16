export class Led {
  private _pin: Pin;
  private _on: boolean = false;
  private _brightness: number = 1.0;

  private _blinkTimeoutID: NodeJS.Timeout = null;
  private _blinkOnTime: number = 0;
  private _blinkOffTime: number = 0;

  constructor (pin: Pin) {
      this._pin = pin;
      this._pin.mode('output');
  }

toggle(state?: boolean) {
  if (!state) {
    return this.toggle(!this._on);
  }

  this._clearBlink();
  this._blinkOnTime = 0;
  this._blinkOffTime = 0;
  this._on = state;
  this._update();

  return this;
};

turnOn() {
  return this.toggle(true);
};

turnOff() {
  return this.toggle(false);
};

isOn() {
  return this._on;
};

_clearBlink() {
  if (this._blinkTimeoutID) {
    clearTimeout(this._blinkTimeoutID);
    this._blinkTimeoutID = null;
  }
};

_blinkOn() {
  this._on = true;
  this._update();
  this._blinkTimeoutID = setTimeout(
    this._blinkOff.bind(this),
    this._blinkOnTime * 1000
  );
};

_blinkOff() {
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
};

blink(onTime, offTime) {
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
};

brightness(value) {
  if (arguments.length === 0) {
    return this._brightness;
  }

  value = Math.max(0.0, Math.min(value, 1.0));
  this._brightness = value;
  this._update();

  return this;
};

_update() {
  var b = this._brightness;
  if (b > 0 && b < 1.0) {
    analogWrite(this._pin, this._on ? b * b * b : 0, { freq: 100 });
  } else {
    digitalWrite(this._pin, this._on);
  }
};


}