import Config from './config.js';
import { Client, IntentsBitField } from 'discord.js';

import * as ImNele from './functions/im-nele/main.js';

const client = new Client({
	intents: [
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.MessageContent,
	],
});

const init = async () => {
	console.log('Starting...');
	await client.login(Config.token);
	await new Promise(done => {
		client.on('ready', done);
	});
	await ImNele.init(client);
	console.log('Logged in successfully');
};

init().catch(console.error);
