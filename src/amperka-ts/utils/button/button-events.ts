import {Subject} from 'rxjs';

export abstract class ButtonEvents {
  protected readonly _hold: Subject<void> = new Subject<void>();
  protected readonly _release: Subject<void> = new Subject<void>();
  protected readonly _click: Subject<void> = new Subject<void>();
  protected readonly _press: Subject<void> = new Subject<void>();

  readonly onHold = this._hold.asObservable();
  readonly onRelease = this._release.asObservable();
  readonly onClick = this._click.asObservable();
  readonly onPress = this._press.asObservable();
}
