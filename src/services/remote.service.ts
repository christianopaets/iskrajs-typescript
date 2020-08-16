import { HttpService } from './http.service';

export class RemoteService {
    private readonly _httpController = new HttpService();

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
