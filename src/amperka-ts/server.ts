import http, { OutgoingHttpHeaders } from 'http';
import url, { UrlWithParsedQuery } from 'url';
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';

export class Server {
  private readonly _server: HttpServer = http.createServer(this._onPageRequest.bind(this));
  private readonly _events: {[key: string]: Function} = {};

  on(types: string | string[], callback: Function) {
    if (typeof types == 'string') {
      types = [types];
    }
    for (var t in types) {
      console.log(t);
      if (!this._events[types[t]]) {
        this._events[types[t]] = callback;
      }
    }
  }

  listen(port?: number) {
    this._server.listen(port || 80);
  }

  private _onPageRequest(req: IncomingMessage, res: ServerResponse) {
    var request = url.parse(req.url as string, true);
    this._event(request.pathname as string, request, res);
  }

  private _event(eventName: string, req: UrlWithParsedQuery, res: ServerResponse) {
    if (this._events[eventName]) {
      // @ts-ignore
      res.send = (content: any, headers: OutgoingHttpHeaders) => {
        if (headers === undefined) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
        } else {
          res.writeHead(200, headers);
        }
        res.write(content);
      };
      this._events[eventName](req, res);
      res.end();
    }
  }
}
