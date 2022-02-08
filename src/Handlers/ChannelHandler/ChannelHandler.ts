/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import { GuildMember, VoiceBasedChannel } from 'discord.js';

interface JoinResponse {
  status: string;
  message: string;
  voiceConnection?: VoiceConnection;
}

export class ChannelHandler {
  public static joinVcChannel(
    member: GuildMember,
    voiceChannel: VoiceBasedChannel,
  ): JoinResponse {
    // Start section: VALIDATE PERMISSIONS
    const bot = member.guild.members.cache.find(
      m => m.id === member.client.user?.id,
    );
    const permissions = voiceChannel.permissionsFor(bot!);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return {
        status: 'error',
        message: 'I need permissions to join and speak to this channel!',
      };
    }
    // End section: VALIDATE PERMISSIONS

    const adapterCreator = member.guild!
      .voiceAdapterCreator as DiscordGatewayAdapterCreator;

    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator,
    });

    return {
      status: 'OK',
      message: `Joined ${voiceChannel.name}`,
      voiceConnection,
    };
  }
}
