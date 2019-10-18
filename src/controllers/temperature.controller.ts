import { HttpController } from './http.controller';

export class TemperatureControler {
  private readonly _httpController = new HttpController();

  save(temperature: any) {
    const data = {
      value: temperature
    };

    this._httpController
      .post('/api/temperature', data)
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  }
}
