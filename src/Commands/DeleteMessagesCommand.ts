import { bold, SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandInteraction, Message, TextChannel } from 'discord.js';

export class DeleteMessagesCommand implements Command {
  data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()

      .addIntegerOption(int =>
        int
          .setName('messages-amount')
          .setDescription('Amount of messages to delete - 100 max.')
          .setAutocomplete(true)
          .setMaxValue(100)
          .setRequired(true),
      )
      .setName('delete-messages')
      .setDescription(
        'Clears messages from the text channel where the command is executed. Max: 100.',
      );
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const channel = interaction.channel as TextChannel;
    const messagesAmount = interaction.options.get('messages-amount')
      ?.value as number;

    const messages = await channel.messages.fetch({
      limit: messagesAmount,
    });

    const filteredMessages: Message[] = [];
    messages.forEach(message => {
      // 1209600000 = 14 days in milliseconds.
      if (message.createdTimestamp > Math.floor(Date.now() - 1209600000)) {
        filteredMessages.push(message);
      }
    });

    channel.bulkDelete(filteredMessages);

    if (filteredMessages.length === messagesAmount) {
      await interaction.reply({
        content: `${bold(`Last ${messagesAmount} messages deleted`)}`,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `${bold(
        `Last ${filteredMessages.length.toString()} messages deleted`,
      )}\nThis command won't work for messages older than 14 days.`,
      ephemeral: true,
    });
  }
}
