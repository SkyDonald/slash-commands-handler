import {
  APIApplicationCommandInteraction,
  APIApplicationCommandOption
} from 'discord-api-types';
import Bot from './Bot';

export default class Command {
  constructor();
  name: string;
  category: string;
  description: string;
  options: Array<APIApplicationCommandOption>;

  run(
    bot: Bot,
    interaction: APIApplicationCommandInteraction,
    args: args
  ): Promise<void>;
}

export interface args {
  [key: string]: any;
}
