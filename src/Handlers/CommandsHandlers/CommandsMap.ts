import { Command } from 'discord.js';

import { PlayCommand } from '../../Commands/PlayCommand';
import { PauseCommand } from '../../Commands/PauseCommand';
import { ResumeCommand } from '../../Commands/ResumeCommand';
import { SkipCommand } from '../../Commands/SkipCommand';
import { StopCommand } from '../../Commands/StopCommand';
import { DeleteMessagesCommand } from '../../Commands/DeleteMessagesCommand';
import { SetRoleCommand } from '../../Commands/SetRoleCommand';
import { HelpCommand } from '../../Commands/HelpCommand';

export const commandsMap = new Map<string, Command>([
  ['play', new PlayCommand()],
  ['pause', new PauseCommand()],
  ['resume', new ResumeCommand()],
  ['skip', new SkipCommand()],
  ['stop', new StopCommand()],
  ['delete-messages', new DeleteMessagesCommand()],
  ['set-role', new SetRoleCommand()],
  ['help', new HelpCommand()],
]);
