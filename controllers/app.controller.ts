import { LightSensor } from './../amperka-ts/light-sensor';
import { config } from './../config';
import { Thermometer } from './../amperka-ts/thermometer';
import { LuminosityController } from './luminosity.controller';
import { RemoteController } from './remote.controller';
import { TemperatureControler } from './temperature.controller';

export class AppController {

  private readonly _temperatureController: TemperatureControler = new TemperatureControler();
  private readonly _remoteController: RemoteController = new RemoteController();
  private readonly _luminosityController: LuminosityController = new LuminosityController();

  private readonly _thermometer: Thermometer = new Thermometer(config.thermometerPin);
  private readonly _lightSensor: LightSensor = new LightSensor(config.lightSensorPin);

  init(): void {
    this._startSensors();
  }

private _startSensors() {
    setInterval(() => {
      this._temperatureController.save(this._thermometer.read('C'));
      this._luminosityController.save(this._lightSensor.read('lx'));
    }, 2000);
}

// function startServer() {
//     server.listen();
//     setInterval(() => {
//         wifi.getIP((err, ip) => {
//             server.listen();
//             saveRemote(ip);
//             console.log(ip);
//         });
//     }, 2000);
// }
}