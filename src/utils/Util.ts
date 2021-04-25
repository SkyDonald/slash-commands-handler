import { APIApplicationCommandInteraction } from 'discord-api-types';
import {
  APIMessage,
  APIMessageContentResolvable,
  DMChannel,
  GuildChannel,
  GuildMember,
  Message,
  MessageEmbed,
  NewsChannel,
  TextChannel
} from 'discord.js';
import Bot from './../structures/Bot';
import axios from 'axios';

export default class Util {
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  async createAPIMessage(
    interaction: APIApplicationCommandInteraction,
    content: APIMessageContentResolvable
  ) {
    const { data, files } = await APIMessage.create(
      // @ts-ignore
      this.bot.client.channels.resolve(interaction.channel_id),
      content
    )
      .resolveData()
      .resolveFiles();

    return { ...data, files };
  }

  async reply(
    interaction: APIApplicationCommandInteraction,
    response: string | APIMessageContentResolvable | Message | MessageEmbed
  ) {
    let data = {
      content: response
    };

    if (typeof response === 'object') {
      // @ts-ignore
      data = await this.createAPIMessage(interaction, response);
    }
    // @ts-ignore
    this.bot.client.api
      // @ts-ignore
      .interactions(interaction.id, interaction.token)
      .callback.post({
        data: {
          type: 5
        }
      });

    await axios(
      `https://discord.com/api/v8/webhooks/${this.bot.client.user!.id}/${
        interaction.token
      }/messages/@original`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          ...data
        }
      }
    );
  }

  async editReply(
    interaction: APIApplicationCommandInteraction,
    response: string | APIMessageContentResolvable | Message | MessageEmbed
  ) {
    let data = {
      content: response
    };

    if (typeof response === 'object') {
      // @ts-ignore
      data = await this.createAPIMessage(interaction, response);
    }

    await axios(
      `https://discord.com/api/v8/webhooks/${this.bot.client.user!.id}/${
        interaction.token
      }/messages/@original`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          ...data
        }
      }
    );
  }

  sendError(text: string) {
    const embed = new MessageEmbed()
      .setColor('RED')
      .setDescription(text)
      .setFooter('Oops! Something went wrong :(');
    return embed;
  }

  badUsage(usage: string) {
    const embed = new MessageEmbed()
      .setTitle('Usage:')
      .setColor('ORANGE')
      .setDescription(usage)
      .setFooter("You didn't write the command correctly...");
    return embed;
  }

  async sleep(timeout: number = 5000) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('');
      }, timeout);
    });
  }

  async tempMessage(
    content: string | any,
    channel: TextChannel | DMChannel | NewsChannel | GuildChannel,
    timeout: number = 5000
  ) {
    // @ts-ignore
    const sended = await channel.send(content);
    setTimeout(async () => {
      await sended.delete().catch(() => {});
    }, timeout);
  }

  checkPerms(member: GuildMember, perms: Permissions | Array<Permissions>) {
    if (typeof perms === 'string') {
      if (!member.hasPermission(perms)) return false;
    } else {
      for (const perm of perms) {
        if (!member.hasPermission(perm)) return false;
      }
    }
    return true;
  }
}

export type Permissions =
  | 'CREATE_INSTANT_INVITE'
  | 'KICK_MEMBERS'
  | 'BAN_MEMBERS'
  | 'ADMINISTRATOR'
  | 'MANAGE_CHANNELS'
  | 'MANAGE_GUILD'
  | 'ADD_REACTIONS'
  | 'VIEW_AUDIT_LOG'
  | 'PRIORITY_SPEAKER'
  | 'STREAM'
  | 'VIEW_CHANNEL'
  | 'SEND_MESSAGES'
  | 'SEND_TTS_MESSAGES'
  | 'MANAGE_MESSAGES'
  | 'EMBED_LINKS'
  | 'ATTACH_FILES'
  | 'READ_MESSAGE_HISTORY'
  | 'MENTION_EVERYONE'
  | 'USE_EXTERNAL_EMOJIS'
  | 'VIEW_GUILD_INSIGHTS'
  | 'CONNECT'
  | 'SPEAK'
  | 'MUTE_MEMBERS'
  | 'DEAFEN_MEMBERS'
  | 'MOVE_MEMBERS'
  | 'USE_VAD'
  | 'CHANGE_NICKNAME'
  | 'MANAGE_NICKNAMES'
  | 'MANAGE_ROLES'
  | 'MANAGE_WEBHOOKS'
  | 'MANAGE_EMOJIS';
