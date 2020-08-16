import isUndefined from 'lodash/isUndefined';
import {IButtonOptions} from '@amperka/utils/button/button-options.interface';
import {ButtonEvents} from '@amperka/utils/button/button-events';
import {TNormalSignal} from '@amperka/utils/button/normal-signal.enum';
import {IOnChange} from '@amperka/utils/button/on-chage.interface';

export class Button extends ButtonEvents {
  private readonly _pin: Pin;
  private readonly _normalSignal: TNormalSignal;
  private readonly _holdTime: number;
  private readonly _debounceTime: number;
  private _holdTimeoutID: NodeJS.Timer;

  get isPressed(): boolean {
    return this._pin.read() !== !!this._normalSignal;
  }

  constructor(pin: Pin, options: IButtonOptions = {}) {
    super();
    this._pin = pin;
    this._normalSignal = options.normalSignal || TNormalSignal.PullUp;
    this._holdTime = options.holdTime || 1;
    this._debounceTime = isUndefined(options.debounce) ? 10 : options.debounce;
    this._init();
  }

  private _init(): void {
    this._pin.mode(this._normalSignal);
    const options = {
      repeat: true,
      edge: 'both',
      debounce: isUndefined(this._debounceTime) ? 10 : this._debounceTime
    };
    setWatch(this._onChange.bind(this), this._pin, options);
  }

  private _onChange(change: IOnChange) {
    const pressed = this._normalSignal === TNormalSignal.PullDown ? change.state : !change.state;
    if (this._holdTime && pressed) {
      this._onHold();
    } else if (!pressed) {
      this._onPressed();
    }
    pressed ? this._press.next() : this._release.next();
  }

  private _onHold(): void {
    this._holdTimeoutID = setTimeout(() => {
      this._hold.next();
      this._holdTimeoutID = null;
    }, this._holdTime * 1000);
  }

  private _onPressed(): void {
    if (this._holdTimeoutID) {
      clearTimeout(this._holdTimeoutID);
      this._holdTimeoutID = null;
      this._click.next();
    }
  }
}
