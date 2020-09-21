import {RTC} from '../../amperka-ts/rtc';
import {format} from 'fecha';

export class WatchService {

  constructor(private readonly rtc: RTC) {
  }

  initSystem(): void {
    this.rtc.setTime();
  }

  getCurrentMinutes(): string {
    return format(this.rtc.getTime('date'), 'mm');
  }

  getCurrentHours(): string {
    return format(this.rtc.getTime('date'), 'HH');
  }
}
