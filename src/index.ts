import { inspect } from 'util';
import Logger from './utils/Logger';
import Bot from './structures/Bot';

new Bot().init();

process.on('unhandledRejection', (_reason, promise) => {
  Logger.error(inspect(promise));
});
process.on('uncaughtException', (err) => {
  Logger.error(err);
});
