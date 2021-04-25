import { ShardingManager, WebhookClient } from 'discord.js';
import 'dotenv/config';
import Logger from './utils/Logger';
import config from './config';

const statusHook = new WebhookClient(
  config.statusHookId,
  config.statusHookToken
);

const sharder = new ShardingManager(`${__dirname}/index.js`, {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
  respawn: true
});

sharder.on('shardCreate', (shard) => {
  Logger.info(`Starting shard #${shard.id}`);
  shard
    .on('ready', async () => {
      const guilds = await shard.fetchClientValue('guilds');
      statusHook.send(
        `Shard **#${shard.id}** ready on **${guilds.cache.length}** servers.`
      );
    })
    .on('disconnect', () => {
      statusHook.send(
        `Shard **#${shard.id}** disconnected from its servers and users temporarily...`
      );
    })
    .on('error', (error) => {
      Logger.error(error);
      statusHook.send(
        `Shard **#${shard.id}** crashed due to an error: ${error.message}`
      );
    })
    .on('reconnecting', () => {
      statusHook.send(
        `Shard **#${shard.id}** reconnection in progress on the servers containing this shard...`
      );
    })
    .on('death', () => {
      statusHook.send(`Shard **#${shard.id}** crashed due to an error.`);
    });
});

sharder.spawn('auto');
