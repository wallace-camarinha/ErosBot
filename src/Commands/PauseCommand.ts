import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, Command, CommandInteraction } from 'discord.js';

export class PauseCommand implements Command {
  data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('pause')
      .setDescription('Pauses the current song.');
  }

  async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
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
        'You must be in my voice channel to pause a song! <3',
      );
      return;
    }

    serverQueue.subscription?.player.pause();

    await interaction.reply('Song paused!');
  }
}
