System.register("controllers/http.controller", [], function (exports_1, context_1) {
    "use strict";
    var HttpController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            HttpController = /** @class */ (function () {
                function HttpController() {
                }
                HttpController.prototype.createOptions = function (path, method, data) {
                    return {
                        host: _host,
                        port: 80,
                        path: path,
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': data.length
                        }
                    };
                };
                return HttpController;
            }());
            exports_1("HttpController", HttpController);
        }
    };
});
System.register("index", ["controllers/http.controller"], function (exports_2, context_2) {
    "use strict";
    var http_controller_1, _http, termometer, sensor, server, led, buzzer, _SSID, _PASSWORD, _host, _interval, httpController, wifi;
    var __moduleName = context_2 && context_2.id;
    function startSensors() {
        setInterval(function () {
            saveTemperature(termometer.read('C'));
            saveLuminosity(sensor.read('lx'));
        }, _interval);
    }
    function startServer() {
        server.listen();
        setInterval(function () {
            wifi.getIP(function (err, ip) {
                server.listen();
                saveRemote(ip);
                console.log(ip);
            });
        }, _interval);
    }
    function saveTemperature(temperature) {
        var data = JSON.stringify({
            value: temperature
        });
        var options = createOptions('/api/temperature', 'POST', data);
        var req = _http.request(options, function (res) {
            console.log("Temperature saved: " + res.statusCode);
        });
        req.end(data);
        req.on('error', function (error) { return console.log('Temperature Error: ' + error.message); });
    }
    function saveRemote(remote) {
        var data = JSON.stringify({
            remote: remote
        });
        var options = createOptions('/api/remote', 'POST', data);
        var req = _http.request(options, function (res) {
            console.log("Remote saved: " + res.statusCode);
        });
        req.end(data);
        req.on('error', function (error) {
            console.log('Remote error: ' + error.message);
        });
    }
    function saveLuminosity(luminosity) {
        var data = JSON.stringify({
            value: luminosity
        });
        var options = createOptions('/api/luminosity', 'POST', data);
        var req = _http.request(options, function (res) {
            console.log("Luminosity saved: " + res.statusCode);
        });
        req.end(data);
        req.on('error', function (error) { return console.log('Luminosity Error: ' + error.message); });
    }
    function createOptions(path, method, data) {
        return {
            host: _host,
            port: 80,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
    }
    return {
        setters: [
            function (http_controller_1_1) {
                http_controller_1 = http_controller_1_1;
            }
        ],
        execute: function () {
            _http = require('http');
            termometer = require('@amperka/thermometer').connect(A3);
            sensor = require('@amperka/light-sensor').connect(A1);
            server = require('@amperka/server').create();
            led = require('@amperka/led').connect(P2);
            buzzer = require('@amperka/buzzer').connect(P8);
            _SSID = 'esc 2015';
            _PASSWORD = '0503308355';
            _host = 'smart-home-back.herokuapp.com';
            _interval = 60000; // 60 sec
            httpController = new http_controller_1.HttpController();
            wifi = require('@amperka/wifi').setup(function (err) {
                wifi.connect(_SSID, _PASSWORD, function (connectErr) {
                    console.log('WiFi Connected');
                    startSensors();
                    startServer();
                });
            });
            // SERVER COMMANDS
            server.on('/', function (req, res) {
                res.send(JSON.stringify({ status: true }));
            });
            server.on('/led/on', function (req, res) {
                led.turnOn();
            });
            server.on('/led/off', function (req, res) {
                led.turnOff();
            });
            server.on('/buzzer/on', function (req, res) {
                buzzer.turnOn();
            });
            server.on('/buzzer/off', function (req, res) {
                buzzer.turnOff();
            });
        }
    };
});
