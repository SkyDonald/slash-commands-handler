// @ts-ignore
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import chalk from 'chalk';

class Logger {
  public static info(msg: string) {
    let time = dayjs().format('HH:mm:ss');
    if (!msg) return;
    let format = `[${chalk.gray(`${time}`)}] ${chalk.blueBright(
      'INFO'
    )} ${msg}`;
    console.log(format);
  }

  public static error(error: string | Error, level?: number) {
    let severity = null;

    if (level === 0) {
      severity = 'DEBUG';
    } else if (level === 1) {
      severity = 'INFO';
    } else if (level === 2) {
      severity = 'WARNING';
    } else if (level === 3) {
      severity = 'ALERT';
    } else if (level === 4) {
      severity = 'ERROR';
    } else if (level === 5) {
      severity = 'EMERGENCY';
    } else {
      severity = 'UNKNOWN';
    }

    let time = dayjs().format('HH:mm:ss');
    let format = `[${chalk.gray(`${time}`)}] ${chalk.redBright(
      `${severity}`
    )} ${error}`;

    console.error(format);
  }
}

export default Logger;
