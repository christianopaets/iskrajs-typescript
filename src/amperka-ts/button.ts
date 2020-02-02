export enum TNormalSignal {
  PullUp = 'input_pullup',
  PullDown = 'input_pulldown',
}

export interface IButtonOptions {
  normalSignal?: TNormalSignal;
  holdTime?: number;
  debounce?: number;
}

export declare interface Button {
  on(event: 'press', listener: () => void): this;
  on(event: 'release', listener: () => void): this;
  on(event: 'click', listener: () => void): this;
  on(event: 'hold', listener: () => void): this;
  on(event: string, listener: Function): this;
}

export class Button extends NodeJS.EventEmitter {
  private readonly _pin: Pin;
  private readonly _normalSignal: TNormalSignal;
  private readonly _holdTime: number;
  private _holdTimeoutID: NodeJS.Timer | null = null;

  constructor(pin: Pin, options: IButtonOptions = {}) {
    super();
    this._pin = pin;
    this._normalSignal = options.normalSignal || TNormalSignal.PullUp;
    this._holdTime = options.holdTime || 1;
    this._init(options);
  }

  private _init(options: IButtonOptions): void {
    this._pin.mode(this._normalSignal);
    const debounce = options.debounce === undefined ? 10 : options.debounce;
    setWatch(this._onChange.bind(this), this._pin, {
      repeat: true,
      edge: 'both',
      debounce: debounce
    });
  }

  private _onChange(e: {state: boolean}) {
    let pressed = this._normalSignal === TNormalSignal.PullDown ? e.state : !e.state;

    if (this._holdTime && pressed) {
      // emit hold event after timeout specified in options
      this._holdTimeoutID = setTimeout(() => {
        this.emit('hold');
        this._holdTimeoutID = null;
      }, this._holdTime * 1000);
    } else if (!pressed) {
      // emit click only if hold was not already emitted
      if (this._holdTimeoutID) {
        clearTimeout(this._holdTimeoutID);
        this._holdTimeoutID = null;
        this.emit('click');
      }
    }

    this.emit(pressed ? 'press' : 'release');
  }

  isPressed(): boolean {
    return this._pin.read() !== !!this._normalSignal;
  }
}
