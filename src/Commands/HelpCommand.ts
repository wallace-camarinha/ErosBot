import { bold, SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandInteraction } from 'discord.js';

export class HelpCommand implements Command {
  public data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('help')
      .setDescription('List all available commands.');
  }

  public execute(interaction: CommandInteraction): Promise<void> {
    let str = '';

    const { commands } = interaction.client;
    commands.forEach(c => {
      str += `Command: "${bold(c.data.name)}":\nDescription: ${
        c.data.description
      }\n\n`;
    });

    return interaction.reply({ content: str });
  }
}
