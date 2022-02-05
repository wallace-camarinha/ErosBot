import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandInteraction } from 'discord.js';

export class StopCommand implements Command {
  data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stops the bot player, resets the queue.');
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const serverQueue = interaction.client.queue.get(interaction.guildId);
    if (!serverQueue) {
      await interaction.reply("I'm not playing anything right now!");
    }

    const member = interaction.guild?.members.cache.get(
      interaction.member!.user.id,
    );
    if (!member) return;
    if (member?.voice.channel !== serverQueue?.voiceChannel) {
      await interaction.reply(
        'You must be in my voice channel to stop the playback! <3',
      );
      return;
    }

    serverQueue.songs = [];
    serverQueue.subscription?.player.stop();

    await interaction.reply(`Stopped playing!`);
  }
}
