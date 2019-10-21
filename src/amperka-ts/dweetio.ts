import http from 'http';

export class Dweetio {
  private readonly _name: string;
  private readonly _url: string;

  constructor(name: string) {
    this._name = name;
    this._url = `http://dweet.io/dweet/for/${this._name}`;
  }

  private _request(query: string, callback: Function) {
    http.get(this._url + '?' + query, function(res) {
      var d = '';
      res.on('data', function(data) {
        d += data;
      });
      res.on('close', function() {
        callback(d);
      });
    });
  }

  send(data: any, callback: Function) {
    var a = [];
    for (var prop in data) {
      a.push(encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]));
    }
    callback = callback || function() {};
    this._request(a.join('&'), callback);
  }

  follow() {
    return `https://dweet.io/follow/${this._name}`;
  }
}
