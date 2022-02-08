/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config';
import { Routes } from 'discord-api-types/rest/v9';
import { REST } from '@discordjs/rest';
import { Command } from 'discord.js';
import { commandsMap } from './CommandsMap';

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);
const commands: Command[] = [];
commandsMap.forEach(c => commands.push(c.data.toJSON()));

export function guildDeployCommands(guildId: string): void {
  rest
    .put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId), {
      body: commands,
    })
    .then(() => console.log(`Successfully registered application commands.`))
    .catch(console.error);
}
