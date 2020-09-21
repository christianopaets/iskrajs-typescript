import {TNormalSignal} from './normal-signal.enum';


export interface IButtonOptions {
  normalSignal?: TNormalSignal;
  holdTime?: number;
  debounce?: number;
}
