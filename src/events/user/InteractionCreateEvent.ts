import Bot from './../../structures/Bot';
import WSEvent from '../../structures/BaseWSEvent';
import { APIApplicationCommandInteraction } from 'discord-api-types';
import { args } from '../../structures/Command';
import Logger from '../../utils/Logger';

export default class InteractionCreateEvent extends WSEvent {
  constructor() {
    super('INTERACTION_CREATE');
  }

  async run(bot: Bot, interaction: APIApplicationCommandInteraction) {
    // @ts-ignore
    const { member } = interaction;
    if (!member)
      return bot.util.reply(
        interaction,
        bot.util.sendError('Commands are not usable inside DMs')
      );

    const command = bot.commands.get(interaction.data.name.toLowerCase());
    if (!command)
      return bot.util.reply(
        interaction,
        bot.util.sendError('Command not found')
      );

    const args: args = {};
    if (interaction.data.options) {
      // @ts-ignore
      for (const { name, value } of interaction.data.options) {
        // @ts-ignore
        args[name] = value;
      }
    }

    // @ts-ignore
    const guild = bot.client.guilds.cache.get(interaction.guild_id);
    const channel = guild?.channels.cache.get(interaction.channel_id);
    if (!channel || !guild)
      return bot.util.reply(
        interaction,
        bot.util.sendError('Commands are not usable inside DMs')
      );

    try {
      command.run(bot, interaction, args);
    } catch (err) {
      Logger.error(err);
      bot.owner.send(
        bot.util.sendError(`${member}\n${command.name}\n\`${err.message}\``)
      );
      bot.util.editReply(
        interaction,
        bot.util.sendError('There was an error trying to execute that command')
      );
    }
  }
}
