// import * as events from 'events';
//
// var socks = [];
// var sockData = ['', '', '', '', ''];
// var MAXSOCKETS = 5;
// var ENCR_FLAGS = ['open', 'wep', 'wpa_psk', 'wpa2_psk', 'wpa_wpa2_psk'];
//
// var netCallbacks: any = {
//   create: function (host, port) {
//     /* Create a socket and return its index, host is a string, port is an integer.
//     If host isn't defined, create a server socket */
//     var sckt;
//     var self = this;
//     if (host === undefined) {
//       sckt = MAXSOCKETS;
//       socks[sckt] = 'Wait';
//       sockData[sckt] = '';
//       at.cmd('AT+CIPSERVER=1,' + port + '\r\n', 10000, function (d) {
//         if (d === 'OK') {
//           socks[sckt] = true;
//         } else {
//           socks[sckt] = undefined;
//           self.emit('err', 'CIPSERVER failed (' + (d ? d : 'Timeout') + ')');
//         }
//       });
//       return MAXSOCKETS;
//     } else {
//       sckt = 0;
//       while (socks[sckt] !== undefined) {
//         sckt++; // find free socket
//       }
//       if (sckt >= MAXSOCKETS) {
//         // throw new Error('No free sockets');
//         self.emit('err', 'No free sockets');
//         return null;
//       }
//       socks[sckt] = 'Wait';
//       sockData[sckt] = '';
//       at.cmd(
//         'AT+CIPSTART=' +
//         sckt +
//         ',"TCP",' +
//         JSON.stringify(host) +
//         ',' +
//         port +
//         '\r\n',
//         10000,
//         function cb(d) {
//           if (d === sckt + ',CONNECT') {
//             socks[sckt] = true;
//             return cb;
//           }
//           if (d === 'OK') {
//             at.registerLine(sckt + ',CLOSED', function () {
//               at.unregisterLine(sckt + ',CLOSED');
//               socks[sckt] = undefined;
//             });
//           } else {
//             socks[sckt] = undefined;
//             // setTimeout(function() {
//             //  throw new Error('CIPSTART failed ('+(d?d:'Timeout')+')');
//             // }, 0);
//             self.emit('err', 'CIPSTART failed (' + (d ? d : 'Timeout') + ')');
//           }
//         }
//       );
//     }
//     return sckt;
//   },
//   /* Close the socket. returns nothing */
//   close: function (sckt) {
//     if (socks[sckt] === 'Wait') {
//       socks[sckt] = 'WaitClose';
//     } else if (socks[sckt] !== undefined) {
//       // socket may already have been closed (eg. received 0,CLOSE)
//       // we need to a different command if we're closing a server
//       at.cmd(
//         (sckt === MAXSOCKETS ? 'AT+CIPSERVER=0' : 'AT+CIPCLOSE=' + sckt) +
//         '\r\n',
//         1000,
//         function () {
//           socks[sckt] = undefined;
//         }
//       );
//     }
//   },
//   /* Accept the connection on the server socket. Returns socket number or -1 if no connection */
//   accept: function () {
//     for (var i = 0; i < MAXSOCKETS; i++) {
//       if (sockData[i] && socks[i] === undefined) {
//         socks[i] = true;
//         return i;
//       }
//     }
//     return -1;
//   },
//   /* Receive data. Returns a string (even if empty).
//   If non-string returned, socket is then closed */
//   recv: function (sckt, maxLen) {
//     if (at.isBusy() || socks[sckt] === 'Wait') {
//       return '';
//     }
//     if (sockData[sckt]) {
//       var r;
//       if (sockData[sckt].length > maxLen) {
//         r = sockData[sckt].substr(0, maxLen);
//         sockData[sckt] = sockData[sckt].substr(maxLen);
//       } else {
//         r = sockData[sckt];
//         sockData[sckt] = '';
//       }
//       return r;
//     }
//     if (!socks[sckt]) {
//       return -1; // close it
//     }
//     return '';
//   },
//   /* Send data. Returns the number of bytes sent - 0 is ok.
//   Less than 0  */
//   send: function (sckt, data) {
//     if (at.isBusy() || socks[sckt] === 'Wait') {
//       return 0;
//     }
//     if (!socks[sckt]) {
//       return -1; // error - close it
//     }
//     // console.log('Send',sckt,data);
//     var cmd = 'AT+CIPSEND=' + sckt + ',' + data.length + '\r\n';
//     at.cmd(cmd, 10000, function cb(d) {
//       if (d === 'OK') {
//         at.register('> ', function () {
//           at.unregister('> ');
//           at.write(data);
//           return '';
//         });
//         return cb;
//       } else if (d === 'Recv ' + data.length + ' bytes') {
//         // all good, we expect this
//         return cb;
//       } else if (d === 'SEND OK') {
//         // we're ready for more data now
//         if (socks[sckt] === 'WaitClose') {
//           netCallbacks.close(sckt);
//         }
//         socks[sckt] = true;
//       } else {
//         socks[sckt] = undefined; // uh-oh. Error.
//         at.unregister('> ');
//       }
//     });
//     // if we obey the above, we shouldn't get the 'busy p...' prompt
//     socks[sckt] = 'Wait'; // wait for data to be sent
//     return data.length;
//   }
// };
//
// export class Wifi extends events.EventEmitter {
//
//   at;
//
//   constructor (usart: Serial = Serial3, connectedCallback) {
//     super();
//     usart.setup(115200, {});
//
//     this.at = require('AT').connect(usart);
//     require('NetworkJS').create(netCallbacks);
//
//     netCallbacks.on('err', function (e) {
//       this.emit('err', e);
//     });
//
//     this.at.register('+IPD', this.ipdHandler);
//     this.reset(connectedCallback);
//   }
//
//   ipdHandler(line) {
//     const colon = line.indexOf(':');
//     if (colon < 0) {
//       return line;
//     }
//     const parms = line.substring(5, colon).split(',');
//     parms[1] = 0 | parms[1];
//     const len = line.length - (colon + 1);
//     if (len >= parms[1]) {
//       sockData[parms[0]] += line.substr(colon + 1, parms[1]);
//       return line.substr(+colon + +parms[1] + 1);
//     } else {
//       sockData[parms[0]] += line.substr(colon + 1, len);
//       return '+IPD,' + parms[0] + ',' + (parms[1] - len) + ':';
//     }
//   }
//
//   debug() {
//     return {
//       socks: socks,
//       sockData: sockData
//     };
//   }
//
//   init(callback) {
//     this.at.cmd('ATE0\r\n', 1000, function cb(d) {
//       // turn off echo
//       if (d === 'ATE0') {
//         return cb;
//       }
//       if (d === 'OK') {
//         at.cmd('AT+CIPMUX=1\r\n', 1000, function (d) {
//           // turn on multiple sockets
//           if (d !== 'OK') {
//             callback('CIPMUX failed: ' + (d ? d : 'Timeout'));
//           } else {
//             callback(null);
//           }
//         });
//       } else {
//         callback('ATE0 failed: ' + (d ? d : 'Timeout'));
//       }
//     });
//   }
//
//   reset (callback) {
//     at.cmd('\r\nAT+RST\r\n', 10000, function cb(d) {
//       // console.log('>>>>>'+JSON.stringify(d));
//       // 'ready' for 0.25, 'Ready.' for 0.50
//       if (d === 'ready' || d === 'Ready.') {
//         setTimeout(function () {
//           this.init(callback);
//         }, 1000);
//       } else if (d === 'jump to run user1 @ 1000') {
//         setTimeout(function () {
//           this.init(callback);
//         }, 5000);
//       } else {
//         if (d === undefined) {
//           callback('No "ready" after AT+RST');
//         } else {
//           return cb;
//         }
//       }
//     });
//   }
//
//   getVersion(callback) {
//     at.cmd('AT+GMR\r\n', 1000, (d) => {
//       // works ok, but we could get more data
//       callback(null, d);
//     });
//   }
//
//   connect (ssid, key, callback) {
//     at.cmd('AT+CWMODE=1\r\n', 1000, function (cwm) {
//       if (cwm !== 'no change' && cwm !== 'OK') {
//         callback('CWMODE failed: ' + (cwm ? cwm : 'Timeout'));
//       } else {
//         at.cmd(
//           'AT+CWJAP=' +
//           JSON.stringify(ssid) +
//           ',' +
//           JSON.stringify(key) +
//           '\r\n',
//           20000,
//           function cb(d) {
//             if (
//               [
//                 'WIFI DISCONNECT',
//                 'WIFI CONNECTED',
//                 'WIFI GOT IP',
//                 '+CWJAP:1'
//               ].indexOf(d) >= 0
//             ) {
//               return cb;
//             }
//
//             if (d !== 'OK') {
//               setTimeout(
//                 callback,
//                 0,
//                 'WiFi connect failed: ' + (d ? d : 'Timeout')
//               );
//             } else {
//               setTimeout(callback, 0, null);
//             }
//           }
//         );
//       }
//     });
//   }
//
//   getAPs (callback) {
//     var aps = [];
//     at.cmdReg(
//       'AT+CWLAP\r\n',
//       5000,
//       '+CWLAP:',
//       function (d) {
//         var ap = d.slice(8, -1).split(',');
//         aps.push({
//           ssid: JSON.parse(ap[1]),
//           enc: ENCR_FLAGS[ap[0]],
//           signal: parseInt(ap[2]),
//           mac: JSON.parse(ap[3])
//         });
//       },
//       function () {
//         callback(null, aps);
//       }
//     );
//   }
//   getConnectedAP (callback) {
//     var con;
//     at.cmdReg(
//       'AT+CWJAP?\r\n',
//       1000,
//       '+CWJAP:',
//       function (d) {
//         con = JSON.parse(d.slice(7));
//       },
//       function () {
//         callback(null, con);
//       }
//     );
//   }
//
//   createAP (ssid, key, channel, enc, callback) {
//     at.cmd('AT+CWMODE=2\r\n', 1000, function (cwm) {
//       if (cwm !== 'no change' && cwm !== 'OK' && cwm !== 'WIFI DISCONNECT') {
//         callback('CWMODE failed: ' + (cwm ? cwm : 'Timeout'));
//       }
//       var encn = enc ? ENCR_FLAGS.indexOf(enc) : 0;
//       if (encn < 0) {
//         callback('Encryption type ' + enc + ' not known - ' + ENCR_FLAGS);
//       } else {
//         at.cmd(
//           'AT+CWSAP=' +
//           JSON.stringify(ssid) +
//           ',' +
//           JSON.stringify(key) +
//           ',' +
//           channel +
//           ',' +
//           encn +
//           '\r\n',
//           5000,
//           function (cwm) {
//             if (cwm !== 'OK') {
//               callback('CWSAP failed: ' + (cwm ? cwm : 'Timeout'));
//             } else {
//               callback(null);
//             }
//           }
//         );
//       }
//     });
//   }
//   getConnectedDevices (callback) {
//     const devs = [];
//     this.at.cmd('AT+CWLIF\r\n', 1000, function r(d) {
//       if (d === 'OK') {
//         callback(null, devs);
//       } else if (d === undefined || d === 'ERROR') {
//         callback('Error');
//       } else {
//         const e = d.split(',');
//         devs.push({ip: e[0], mac: e[1]});
//         return r;
//       }
//     });
//   }
//
//   getIP (callback) {
//     let ip;
//     this.at.cmdReg('AT+CIFSR\r\n', 1000, '+CIFSR', (d) => {
//         if (!ip && d.indexOf(',') >= 0) {
//           ip = JSON.parse(d.slice(d.indexOf(',') + 1));
//         }
//       },
//       (d) => {
//         if (d !== 'OK') {
//           callback('CIFSR failed: ' + d);
//         } else {
//           callback(null, ip);
//         }
//       }
//     );
//   }
//
// }
