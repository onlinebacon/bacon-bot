import Config from './config.js';
import { Client, IntentsBitField } from 'discord.js';

import * as ImNele from './functions/im-nele/main.js';
import * as Wipe from './functions/wipe/main.js';
import * as Instances from './functions/instances/main.js';

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
	console.log('Logged in successfully');
	await new Promise(done => {
		client.on('ready', done);
	});
	console.log('Client ready');
	await Promise.all([
		ImNele.init(client),
		Wipe.init(client),
		Instances.init(client),
	]);
	console.log('Functionalities initialized');
};

init().catch(console.error);
