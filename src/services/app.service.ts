import {config} from '../config';
import {Led} from '../amperka-ts/led';

export class AppService {

  readonly led: Led = new Led(config.led);

  constructor() {
    this.led.turnOn();
  }
}
