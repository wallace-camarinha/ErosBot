import { AudioResource } from '@discordjs/voice';
import { Queue, Song } from 'discord.js';

export interface ISongManager {
  getSong(inputStr: string): Promise<Song>;
  createResource(song: Song): AudioResource;
  getNextResource(serverQueue: Queue | undefined): AudioResource | undefined;
}
