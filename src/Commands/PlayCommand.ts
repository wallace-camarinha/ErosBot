/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus, createAudioPlayer } from '@discordjs/voice';
import {
  CacheType,
  Command,
  CommandInteraction,
  GuildMember,
  Queue,
  Song,
  TextChannel,
} from 'discord.js';

import { ChannelHandler } from '../Utils/ChannelHandler/ChannelHandler';
import { SongHandler } from '../Utils/SongHandler/SongHandler';

const songHandler = new SongHandler();

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
    const member = interaction.guild?.members.cache.get(
      interaction.member!.user.id,
    );
    const voiceChannel = member?.voice.channel;

    if (!member || !voiceChannel) {
      await interaction.reply('Can not run this command!');
      return;
    }

    const { queue } = interaction.client;

    const songInput = interaction.options.get('song')!.value as string;
    const song = await songHandler.getSong(songInput);

    const serverQueue = interaction.client.queue.get(interaction.guildId);
    if (!serverQueue) {
      const queueConstruct: Queue = {
        textChannel: interaction.channel as TextChannel,
        voiceChannel,
        audioPlayer: createAudioPlayer(),
        connection: undefined,
        songs: [],
        volume: 5,
        playing: true,
      };

      queue.set(interaction.guildId, queueConstruct);
      queueConstruct.songs.push(song);

      const joinResponse = ChannelHandler.joinVcChannel(member, voiceChannel);
      try {
        const connection = joinResponse.voiceConnection;
        queueConstruct.connection = connection;
        const songResponse = this.play(interaction, queueConstruct.songs[0]);

        await interaction.reply({
          embeds: [this.embedResponse(songResponse, member)],
        });
      } catch (err) {
        console.log(err);
        queue.delete(interaction.guildId);
        await interaction.reply(`There was an error\n${err}`);
        return;
      }
    } else {
      serverQueue.songs.push(song);
      await interaction.reply(`${song.title} has been added to the queue!`);
    }
  }

  public play(interaction: CommandInteraction, song: Song): Song {
    const { queue } = interaction.client;
    const { guild } = interaction;
    const serverQueue = queue.get(guild!.id);

    if (!song) {
      queue.delete(guild!.id);
      return song;
    }

    serverQueue!.subscription = serverQueue?.connection?.subscribe(
      serverQueue.audioPlayer,
    );

    const resource = songHandler.createResource(song);

    serverQueue!.subscription?.player.play(resource);

    // Refactor
    serverQueue?.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      const nextResource = songHandler.getNextResource(serverQueue);
      if (!nextResource) {
        queue.delete(interaction.guildId);
        return;
      }

      serverQueue!.subscription?.player.play(nextResource);
      interaction.channel?.send(`Now playing ${serverQueue.songs[0].title}`);
    });

    return song;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public embedResponse(songResponse: Song, member: GuildMember): any {
    const embed = {
      color: '#372549',
      title: `Now Playing ${songResponse.title}`,
      url: songResponse.url,
      thumbnail: songResponse.songInfo?.bestThumbnail,
      description: `${member.user}`,
    };

    return embed;
  }
}
