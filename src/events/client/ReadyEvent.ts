import Bot from '../../structures/Bot';
import Event from '../../structures/BaseEvent';
import Logger from '../../utils/Logger';

export default class ReadyEvent extends Event {
  constructor() {
    super('ready');
  }

  async run(bot: Bot) {
    if (bot.env.NODE_ENV !== 'production')
      return Logger.info('Running in test environment');
    Logger.info(`${bot.client.user?.username} is ready!`);
  }
}
