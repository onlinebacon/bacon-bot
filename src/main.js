import { config } from './config.js';
import { loadCommands } from './commands/load-commands.js';
import { Client, IntentsBitField } from 'discord.js';
import { servers } from './servers/servers.js';

const client = new Client({
	intents: [
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.MessageContent,
	],
});

const main = async () => {
	const readyPromise = new Promise(done => client.on('ready', done));
	await Promise.all(
		servers.map(server => loadCommands({ client, server })),
	);
	await client.login(config.token);
	await readyPromise;
};

main()
	.then(() => console.log('Client ready'))
	.catch(console.error);
