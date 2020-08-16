import {TNormalSignal} from '@amperka/utils/button/normal-signal.enum';


export interface IButtonOptions {
  normalSignal?: TNormalSignal;
  holdTime?: number;
  debounce?: number;
}
