import 'dotenv/config';
import Client from './Client/Client';

import { ReadyEvent } from './Events/ReadyEvent';
import { InteractionCreateEvent } from './Events/InteractionCreateEvent';

export const client = new Client();

const ready = new ReadyEvent();
const interactionCreate = new InteractionCreateEvent();

client.on('interactionCreate', async (...args) =>
  interactionCreate.execute(...args),
);

client.once('ready', (...args) => ready.execute(...args));

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.login(process.env.DISCORD_TOKEN);
