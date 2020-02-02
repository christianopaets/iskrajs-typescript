import { HttpController } from './http.controller';

export class RemoteController {
    private readonly _httpController = new HttpController();

    save(remote: string) {
    const data = {
      remote: remote
    };

    this._httpController
      .post('/api/remote', data)
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  }
}