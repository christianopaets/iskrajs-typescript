import { HttpService } from './http.service';

export class LuminosityService {
    private readonly _httpController = new HttpService();

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
