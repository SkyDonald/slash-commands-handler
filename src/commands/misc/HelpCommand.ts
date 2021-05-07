import Bot from '../../structures/Bot';
import BaseCommand from '../../structures/BaseCommand';
import {
  APIApplicationCommandInteraction
} from 'discord-api-types';
import { MessageEmbed } from 'discord.js';
import Command, { args } from '../../structures/Command';

export default class InfosCommand extends BaseCommand {
  constructor() {

    super('help', 'misc', 'Gets the list of all available commands', [
      {
        type: 3,
        name: 'command',
        description: 'The command you want to get help for',
        required: false
      }
    ]);
  }

  async run(
    bot: Bot,
    interaction: APIApplicationCommandInteraction,
    args: args
  ) {
    const command = bot.commands.get(args['command']);
    if (command) {
      const embed = new MessageEmbed()
        .setColor(bot.config.embedColor)
        .setTimestamp()
        .setDescription(
          `${command.description}\nUsage: \`/${
            command.name
          } ${command.options.map((option) =>
            option.required ? `<${option.name}>` : `(${option.name})`
          )}\``
        )
        .setTitle(formatCase(command.name));
      await bot.util.reply(interaction, embed);
    } else {
      const help: {
        [category: string]: Array<Command>;
      } = {};
      bot.commands.forEach((command) => {
        if (command.category === 'admin') return;
        const cat = command.category;
        if (!help.hasOwnProperty(cat)) help[cat] = [];
        help[cat].push(command);
      });

      const embed = new MessageEmbed()
        .setColor(bot.config.embedColor)
        .setTimestamp()
        .setThumbnail(
          'https://discord.com/assets/5f8aee4f266854e41de9778beaf7abca.svg'
        )
        .setTitle('Help Menu');

      for (const category in help) {
        embed.addField(
          `${formatCase(category)}`,
          `\`${help[category].map((command) => command.name).join('`, `')}\`.`
        );
      }

      await bot.util.reply(interaction, embed);
    }
  }
}

function formatCase(str: string): string {
  return str.split('')[0].toUpperCase() + str.slice(1).toLowerCase();
}
