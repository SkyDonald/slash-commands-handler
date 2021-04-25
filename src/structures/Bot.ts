import { Client, ClientOptions, Collection, User } from 'discord.js';
import 'dotenv/config';
import config from './../config';
import Util from './../utils/Util';
import Command from './Command.d';
import Loader from './../utils/Loader';
import initCommand from './../initCommands';
import Logger from '../utils/Logger';

class Bot {
  public client: Client;
  public env: typeof process.env;
  public config: typeof config;
  public util: Util;
  public commands: Collection<string, Command>;
  // @ts-ignore
  public owner: User;

  constructor(clientOptions?: ClientOptions) {
    this.client = new Client(clientOptions);
    this.env = process.env;
    this.config = config;
    this.util = new Util(this);
    this.commands = new Collection();
  }

  public async init() {
    try {
      new Loader(this).loadCommands().loadEvents();

      await this.client.login(this.env.DISCORD_TOKEN);
      this.owner = await this.client.users.fetch('764213893815468042');

      await initCommand(this);
    } catch (err) {
      Logger.error(err);
    }
  }
}

export default Bot;
