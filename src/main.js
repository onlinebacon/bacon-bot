const Config = require('./config.js');
const { Client, IntentsBitField } = require('discord.js');
const loadCommands = require('./commands/load-commands.js');

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
	await loadCommands(client);
	await client.login(Config.token);
	await readyPromise;
};

main()
	.then(() => console.log('Client ready'))
	.catch(console.error);
