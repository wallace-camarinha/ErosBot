import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandInteraction } from 'discord.js';

export class SetRoleCommand implements Command {
  data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .addRoleOption(r =>
        r
          .setName('role')
          .setDescription('Select a role the role to be given')
          .setRequired(true),
      )
      .addUserOption(u =>
        u
          .setName('user')
          .setDescription(
            'Select the user to receive the role, start typing if not showing in the list',
          )
          .setRequired(true),
      )
      .setName('set-role')
      .setDescription('WORK IN PROGRESS!');
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    if (interaction.channel?.type !== 'GUILD_TEXT') return;

    const roleId = interaction.options.get('role')?.role?.id;
    const userId = interaction.options.get('user')?.user?.id;

    if (!userId || !roleId) return;
    const member = await interaction.guild?.members.fetch(userId);
    const role = await interaction.guild?.roles.fetch(roleId);
    if (!member || !role) return;

    await member.roles.add(role);

    await interaction.reply({
      content: `${member.displayName} is now a ${role.name}`,
    });
  }
}
