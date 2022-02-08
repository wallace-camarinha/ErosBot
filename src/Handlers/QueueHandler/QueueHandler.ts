import { createAudioPlayer } from '@discordjs/voice';
import {
  CommandInteraction,
  CacheType,
  Queue,
  Song,
  TextChannel,
  VoiceBasedChannel,
  GuildMember,
} from 'discord.js';

import { ChannelHandler } from '../ChannelHandler/ChannelHandler';

export class QueueHandler {
  public static async handleQueue(
    interaction: CommandInteraction,
    member: GuildMember,
    song: Song,
    voiceChannel: VoiceBasedChannel,
  ): Promise<Queue> {
    let serverQueue = interaction.client.queue.get(interaction.guildId);

    if (!serverQueue) {
      serverQueue = this.createQueue(interaction, voiceChannel);
      serverQueue.songs.push(song);

      const joinResponse = ChannelHandler.joinVcChannel(member, voiceChannel);
      serverQueue.connection = joinResponse.voiceConnection;
    } else {
      serverQueue.songs.push(song);
      await interaction.reply(`${song.title} has been added to the queue!`);
    }

    return serverQueue;
  }

  private static createQueue(
    interaction: CommandInteraction<CacheType>,
    voiceChannel: VoiceBasedChannel,
  ): Queue {
    const queueConstruct: Queue = {
      textChannel: interaction.channel as TextChannel,
      voiceChannel,
      audioPlayer: createAudioPlayer(),
      connection: undefined,
      songs: [],
      volume: 5,
      playing: true,
    };
    const queueMap = interaction.client.queue.set(
      interaction.guildId,
      queueConstruct,
    );

    return queueMap.get(interaction.guildId)!;
  }

  public static deleteQueue(interaction: CommandInteraction): void {
    interaction.client.queue.delete(interaction.guildId);
  }
}
