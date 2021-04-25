import { URLSearchParams } from 'url';
import Bot from './structures/Bot';
import axios from 'axios';
import Logger from './utils/Logger';
import { APIApplicationCommand } from 'discord-api-types';

export default async function initCommands(bot: Bot) {
  const { access_token } = await getToken(
    bot.env.DISCORD_ID!,
    bot.env.DISCORD_SECRET!
  );
  const res = await axios(
    `https://discord.com/api/v8/applications/${bot.env.DISCORD_ID!}/commands`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }
  );
  const commands: Array<string> = res.data.map(
    (c: APIApplicationCommand) => c.name
  );

  let i: number = 1;
  bot.commands.forEach(async (command) => {
    if (commands.includes(command.name)) return;
    await bot.util.sleep(5000 * i++);
    const res = await axios({
      url: `https://discord.com/api/v8/applications/${bot.env
        .DISCORD_ID!}/commands`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      data: {
        name: command.name,
        description: command.description,
        options: command.options
      }
    });
    Logger.info(`${command.name}: ${res.status} ${res.statusText}`);
  });
}

function getToken(
  clientID: string,
  clientSecret: string
): Promise<{
  access_token: string;
}> {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('scope', 'applications.commands.update');
    axios({
      url: 'https://discord.com/api/oauth2/token',
      method: 'POST',
      data: data.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientID}:${clientSecret}`
        ).toString('base64')}`
      }
    })
      .then((value) => {
        resolve(value.data);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}
