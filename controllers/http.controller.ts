import { THttpMethod } from './../enums/http-method.enum';
import * as http from 'http';

export class HttpController {
  private readonly _host: string = 'smart-home-back.herokuapp.com';

  private _http = http;

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
      const req = this._http.request(options, (res: any) => resolve(res));
      req.on('error', (error: any) => reject(error));
    });
    
  }
}
