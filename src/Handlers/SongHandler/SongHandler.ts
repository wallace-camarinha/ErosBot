/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AudioResource,
  createAudioResource,
  StreamType,
} from '@discordjs/voice';
import { Queue, Song } from 'discord.js';

import ytdl from 'ytdl-core';
import ytsr, { Video } from 'ytsr';

export class SongHandler {
  public static async getSong(inputStr: string): Promise<Song> {
    const result = await ytsr(inputStr, { limit: 1 });
    const video = result.items[0] as Video;

    const song: Song = {
      /* Creating a member variable. */

      title: video.title,
      url: video.url,
      songInfo: video,
    };

    return song;
  }

  public static createResource(song: Song): AudioResource {
    const resource = createAudioResource(
      ytdl(song.url, { filter: 'audioonly' }),
      {
        inputType: StreamType.Arbitrary,
      },
    );

    return resource;
  }

  public static getNextResource(
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
