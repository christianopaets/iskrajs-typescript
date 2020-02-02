// import * as wifi from '../../amperka/wifi.js';

export class WifiController {

  private _ssid: string;

  private _password: string;

  // private _wifi

  constructor(ssid: string, password: string) {
    this._ssid = ssid;
    this._password = password;
  }

  // createConnection(): any {
  //   const wifi1 = wifi.setup(err => {
  //     wifi.connect(_SSID, _PASSWORD, connectErr => {
  //       console.log('WiFi Connected');
  //       startSensors();
  //       startServer();
  //     });
  //   });
  // }
}
