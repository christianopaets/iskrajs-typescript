import {Motor} from './amperka-ts/motor';

const leftMotor = new Motor(Motor.defaultM1);
const rightMotor = new Motor(Motor.defaultM2);
const speed = .3;

leftMotor.write(speed);
rightMotor.write(-speed);

setTimeout(() => {
  leftMotor.stop();
  rightMotor.stop();
}, 2000);
