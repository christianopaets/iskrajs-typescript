import { LightSensor } from '@amperka/light-sensor';
import { config } from '../config';
import { Thermometer } from '@amperka/thermometer';
import { LuminosityController } from './luminosity.controller';
import { RemoteController } from './remote.controller';
import { TemperatureControler } from './temperature.controller';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';

export class AppController {
  private readonly _temperatureController: TemperatureControler = new TemperatureControler();
  private readonly _remoteController: RemoteController = new RemoteController();
  private readonly _luminosityController: LuminosityController = new LuminosityController();

  private readonly _thermometer: Thermometer = new Thermometer(
    config.thermometerPin
  );
  private readonly _lightSensor: LightSensor = new LightSensor(
    config.lightSensorPin
  );

  init(): void {
    this._startSensors();
  }

  private _startSensors() {
    interval(2000)
      .pipe(tap(() => this._temperatureController.save(this._thermometer.read('C'))))
      .pipe(tap(() => this._luminosityController.save(this._lightSensor.read('lx'))))
      .subscribe();
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
