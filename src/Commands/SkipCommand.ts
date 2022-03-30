import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandInteraction, GuildMember } from 'discord.js';
import { SongHandler } from '../Handlers/SongHandler/SongHandler';

export class SkipCommand implements Command {
  data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('skip')
      .setDescription('Skips to the next song.');
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const serverQueue = interaction.client.queue.get(interaction.guildId);
    if (!serverQueue) {
      await interaction.reply("I'm not playing anything right now!");
    }

    const member = interaction.member as GuildMember;

    if (member?.voice.channel !== serverQueue?.voiceChannel) {
      await interaction.reply(
        'You must be in my voice channel to skip a song! <3',
      );
      return;
    }

    const nextResource = SongHandler.getNextResource(serverQueue);

    if (!nextResource) {
      serverQueue.subscription?.player.stop();
      await interaction.reply('Skipped all songs, wanna add some more?');
      return;
    }

    serverQueue.subscription?.player.play(nextResource);

    await interaction.reply(`Now playing ${serverQueue.songs[0].title}`);
  }
}
