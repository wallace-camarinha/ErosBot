import { SlashCommandBuilder, Collection, TextChannel } from 'discord.js';
import {
  VoiceConnection,
  AudioPlayer,
  PlayerSubscription,
} from '@discordjs/voice';
import { Video } from 'ytsr';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    queue: Map<unknown, Queue>;
  }

  export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
  }

  export interface Song {
    title: string;
    url: string;
    songInfo?: Video;
  }

  export interface Queue {
    textChannel: TextChannel;
    voiceChannel: VoiceBasedChannel;
    connection?: VoiceConnection;
    audioPlayer: AudioPlayer;
    songs: Song[];
    volume: number;
    playing: boolean;
    subscription?: PlayerSubscription;
  }
}
