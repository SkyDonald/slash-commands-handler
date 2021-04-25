import { APIApplicationCommandOption } from 'discord-api-types';

export default class BaseCommand {
  public name: string;
  public category: string;
  public description: string;
  public options: Array<APIApplicationCommandOption>;

  constructor(
    name: string,
    category: string,
    description: string,
    options: Array<APIApplicationCommandOption>
  ) {
    this.name = name;
    this.category = category;
    this.description = description;
    this.options = options;
  }
}
