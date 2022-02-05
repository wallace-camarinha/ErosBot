/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AudioResource,
  createAudioResource,
  StreamType,
} from '@discordjs/voice';
import { Queue, Song } from 'discord.js';

import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';

import { ISongManager } from './interfaces/ISongManager';

export class SongHandler implements ISongManager {
  public async getSong(inputStr: string): Promise<Song> {
    const result = await ytsr(inputStr, { limit: 1 });
    const video = result.items[0] as Video;

    const song: Song = {
      title: video.title,
      url: video.url,
      songInfo: video,
    };

    return song;
  }

  public createResource(song: Song): AudioResource {
    const resource = createAudioResource(
      ytdl(song.url, { filter: 'audioonly' }),
      {
        inputType: StreamType.Arbitrary,
      },
    );

    return resource;
  }

  public getNextResource(
    serverQueue: Queue | undefined,
  ): AudioResource | undefined {
    serverQueue?.songs.shift();
    if (serverQueue?.songs.length === 0) {
      return undefined;
    }

    const resource = this.createResource(serverQueue!.songs[0]);
    return resource;
  }
}
