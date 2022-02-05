import { Interaction } from 'discord.js';
import { IEvents } from './IEvents';

export class InteractionCreateEvent implements IEvents {
  name: 'interactionCreate';

  once: false;

  async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;
    if (interaction.channel?.type !== 'GUILD_TEXT') return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
}
