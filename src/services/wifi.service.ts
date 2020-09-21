import {setup} from '../amperka-ts/network';

export class WifiService {

  private _ssid: string = 'Wenor2_4';

  private _password: string = '02091988';

  private _wifi;

  constructor() {
    Serial3.setup(115200, {});
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._wifi = setup(Serial3, (err) => {
        if(err) {
          reject(err);
          return;
        }
        this._wifi.connect(this._ssid, this._password, (err) => {
          if (err) {
            reject(err);
            return;
          }
          print('Connected');
          resolve();
        });
      });
    });
  }

}
