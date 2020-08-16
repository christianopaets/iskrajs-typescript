import {config} from '../config';
import {Led} from '@amperka/led';

export class AppService {

  readonly led: Led = new Led(config.led);

  constructor() {
    console.log(1, 'asddsa');
    this.led.turnOn();
  }
}
