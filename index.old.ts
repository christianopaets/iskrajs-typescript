const _http = require('http');
// const termometer = require('@amperka/thermometer').connect(A3);
// const sensor = require('@amperka/light-sensor').connect(A1);
// const server = require('@amperka/server').create();
// const led = require('@amperka/led').connect(P2);
// const buzzer = require('@amperka/buzzer').connect(P8);

const _SSID = 'esc 2015';
const _PASSWORD = '0503308355';
const _host = 'smart-home-back.herokuapp.com';
const _interval = 60000; // 60 sec

const wifi = require('@amperka/wifi').setup((err) => {
    wifi.connect(_SSID, _PASSWORD, (connectErr) => {
        console.log('WiFi Connected');
        // startSensors();
        // startServer();
    });
});

