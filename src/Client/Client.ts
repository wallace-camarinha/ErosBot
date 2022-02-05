import { Client, Collection, Intents } from 'discord.js';

export default class extends Client {
  constructor() {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    });

    this.commands = new Collection();

    this.queue = new Map();
  }
}
