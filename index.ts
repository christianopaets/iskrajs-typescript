import { Server } from './amperka-ts/server';
import { Buzzer } from './amperka-ts/buzzer';

const buzzer = new Buzzer(P8);

const server = new Server();
server.listen();

server.on('/led/on', () => {
  led.turnOn();
});

server.on('/led/off', () => {
  led.turnOff();
});

server.on('/buzzer/on', () => {
  buzzer.turnOn();
});

server.on('/buzzer/off', () => {
  buzzer.turnOff();
});