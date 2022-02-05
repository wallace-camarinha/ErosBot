import { Client } from 'discord.js';
import { guildDeployCommands } from '../CommandsHandlers/guildDeployCommands';
import { setCommands } from '../CommandsHandlers/setCommands';
import { IEvents } from './IEvents';

export class ReadyEvent implements IEvents {
  name: 'ready';

  once: true;

  execute(arg: Client): void {
    if (!arg.user) return;

    // Uncomment the following line to deploy the commands to every guild the bot is in.
    // arg.guilds.cache.forEach(guild => guildDeployCommands(guild.id));

    setCommands();

    console.log(`Ready! Logged in as ${arg.user.tag}`);
  }
}
