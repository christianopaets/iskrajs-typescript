const _http = require('http');
const termometer = require('@amperka/thermometer').connect(A3);
const sensor = require('@amperka/light-sensor').connect(A1);
const server = require('@amperka/server').create();
const led = require('@amperka/led').connect(P2);
const buzzer = require('@amperka/buzzer').connect(P8);

const _SSID = 'esc 2015';
const _PASSWORD = '0503308355';
const _host = 'smart-home-back.herokuapp.com';
const _interval = 60000; // 60 sec

const wifi = require('@amperka/wifi').setup((err) => {
    wifi.connect(_SSID, _PASSWORD, (connectErr) => {
        console.log('WiFi Connected');
        startSensors();
        startServer();
    });
});

function startSensors() {
    setInterval(() => {
        saveTemperature(termometer.read('C'));
        saveLuminosity(sensor.read('lx'));
    }, _interval);
}

function startServer() {
    server.listen();
    setInterval(() => {
        wifi.getIP((err, ip) => {
            server.listen();
            saveRemote(ip);
            console.log(ip);
        });
    }, _interval);
}

function saveTemperature(temperature) {
    const data = JSON.stringify({
        value: temperature
    });

    const options = createOptions('/api/temperature', 'POST', data);

    const req = _http.request(options, (res) => {
        console.log(`Temperature saved: ${res.statusCode}`);
    });
    req.end(data);
    req.on('error', (error) => console.log('Temperature Error: ' + error.message));
}

function saveRemote(remote) {
    const data = JSON.stringify({
        remote: remote
    });

    const options = createOptions('/api/remote', 'POST', data);

    const req = _http.request(options, (res) => {
        console.log(`Remote saved: ${res.statusCode}`);
    });
    req.end(data);
    req.on('error', (error) => {
        console.log('Remote error: ' + error.message);
    });
}

function saveLuminosity(luminosity) {
    const data = JSON.stringify({
        value: luminosity
    });

    const options = createOptions('/api/luminosity', 'POST', data);

    const req = _http.request(options, (res) => {
        console.log(`Luminosity saved: ${res.statusCode}`);
    });
    req.end(data);
    req.on('error', (error) => console.log('Luminosity Error: ' + error.message));
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

// SERVER COMMANDS

server.on('/', (req, res) => {
    res.send(JSON.stringify({ status: true }));
});

server.on('/led/on', (req, res) => {
    led.turnOn();
});

server.on('/led/off', (req, res) => {
    led.turnOff();
});

server.on('/buzzer/on', (req, res) => {
    buzzer.turnOn();
});

server.on('/buzzer/off', (req, res) => {
    buzzer.turnOff();
});