import Bot from './../structures/Bot';
import { readdirSync } from 'fs';
import { resolve, sep } from 'path';
import Command from '../structures/BaseCommand';
import Event from '../structures/BaseEvent';
import WSEvent from '../structures/BaseWSEvent';
import Logger from './Logger';
const commandDir = resolve(`${process.cwd()}${sep}dist${sep}commands`);
const eventDir = resolve(`${process.cwd()}${sep}dist${sep}events`);

export default class Loader {
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  loadEvents(): Loader {
    readdirSync(eventDir).forEach(async (dirs) => {
      const events = readdirSync(
        `${eventDir}${sep}${dirs}${sep}`
      ).filter((files) => files.endsWith('.js'));

      for (const file of events) {
        try {
          const Evt = require(`${eventDir}${sep}${dirs}${sep}${file}`)?.default;
          if (!Evt) continue;
          if (Evt.prototype instanceof Event) {
            const event = new Evt();
            this.bot.client.on(event.name, event.run.bind(null, this.bot));
          } else if (Evt.prototype instanceof WSEvent) {
            const event = new Evt();
            this.bot.client.ws.on(event.name, event.run.bind(null, this.bot));
          }
        } catch (err) {
          Logger.error(err);
        }
      }
    });
    return this;
  }

  loadCommands(): Loader {
    readdirSync(commandDir).forEach(async (dirs) => {
      const commands = readdirSync(
        `${commandDir}${sep}${dirs}${sep}`
      ).filter((files) => files.endsWith('.js'));

      for (const file of commands) {
        try {
          const Cmd = require(`${commandDir}${sep}${dirs}${sep}${file}`)
            ?.default;
          if (!Cmd) continue;
          if (Cmd.prototype instanceof Command) {
            const command = new Cmd();
            this.bot.commands.set(command.name, command);
          }
        } catch (err) {
          Logger.error(err);
        }
      }
    });
    return this;
  }
}
