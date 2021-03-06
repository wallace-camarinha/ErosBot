/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus } from '@discordjs/voice';
import {
  CacheType,
  Command,
  CommandInteraction,
  GuildMember,
  Song,
} from 'discord.js';

import { QueueHandler } from '../Handlers/QueueHandler/QueueHandler';
import { SongHandler } from '../Handlers/SongHandler/SongHandler';

export class PlayCommand implements Command {
  data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .addStringOption(str =>
        str
          .setName('song')
          .setDescription('The name or URL of the song you wanna play!')
          .setRequired(true),
      )
      .setName('play')
      .setDescription('Plays a song in your channel!');
  }

  public async execute(
    interaction: CommandInteraction<CacheType>,
  ): Promise<void> {
    const member = interaction.member as GuildMember;
    const voiceChannel = member?.voice.channel;

    if (!member || !voiceChannel) {
      await interaction.reply(
        'You need to be in a voice channel to run this command!',
      );
      return;
    }

    const songString = interaction.options.get('song')?.value as string;
    const song = await SongHandler.getSong(songString);

    const serverQueue = await QueueHandler.handleQueue(
      interaction,
      member,
      song,
      voiceChannel,
    );

    try {
      const songResponse = this.play(interaction, serverQueue!.songs[0]);
      await interaction.reply({
        content: `Now playing ${songResponse.title}\n${member.user}`,
      });
    } catch (err) {
      console.log(err);
      QueueHandler.deleteQueue(interaction);
      await interaction.reply(`There was an error\n${err}`);
      return;
    }
  }

  public play(interaction: CommandInteraction, song: Song): Song {
    const { guild } = interaction;
    const serverQueue = interaction.client.queue.get(guild!.id);

    if (!song) {
      QueueHandler.deleteQueue(interaction);
      return song;
    }

    serverQueue!.subscription = serverQueue?.connection?.subscribe(
      serverQueue.audioPlayer,
    );

    const resource = SongHandler.createResource(song);
    serverQueue!.subscription?.player.play(resource);

    // Refactor
    serverQueue?.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      const nextResource = SongHandler.getNextResource(serverQueue);
      if (!nextResource) {
        QueueHandler.deleteQueue(interaction);
        return;
      }

      serverQueue!.subscription?.player.play(nextResource);
      interaction.channel?.send(`Now playing ${serverQueue.songs[0].title}`);
    });

    return song;
  }
}
