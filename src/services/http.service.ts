import { THttpMethod } from '../enums/http-method.enum';
import http from 'http';

export class HttpService {
  private readonly _host: string = 'smart-home-back.herokuapp.com';

  private _createOptions(path: string, method: THttpMethod, data: string): any {
    return {
      host: this._host,
      port: 80,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
  }

  post(url: string, data: any): Promise<any> {
    const options = this._createOptions(url, THttpMethod.Post, JSON.stringify(data));

    return new Promise((resolve: any, reject: any) => {
      const req = http.request(options, (res: any) => resolve(res));
      req.on('error', (error: any) => reject(error));
    });
  }

  get<Response = any>(url: string): Promise<object> {
    return new Promise<object>(((resolve, reject) => {
      http.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)))
        res.on('error', err => reject(err));
      });
    }));
  }
}
