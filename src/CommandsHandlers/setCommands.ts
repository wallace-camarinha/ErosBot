import { client } from '..';
import { commandsMap } from './CommandsMap';

export function setCommands(): void {
  commandsMap.forEach(c => client.commands.set(c.data.name, c));
}
