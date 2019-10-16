import { HttpController } from './http.controller';

export class LuminosityController {
    private readonly _httpController = new HttpController();

    save(luminosity: number) {
    const data = {
      value: luminosity
    };

    this._httpController
      .post('/api/luminosity', data)
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  }
}