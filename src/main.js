import Config from './config.js';
import { Client, IntentsBitField } from 'discord.js';
import ClientAdapter from './wrappers/client-wrapper.js';
import Commands from './lib/commands/Commands.js';
import './commands/wipe.js';

const client = new Client({
	intents: [
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.MessageContent,
	],
});

const cli = new ClientAdapter(client);

const init = async () => {
	await client.login(Config.token);
	await new Promise(done => client.on('ready', done));
	cli.onMessage(async (ctx) => {
		if (Config.debug && !ctx.msg.isFromRoot()) return;
		try {
			await Commands.handleMessage(ctx);
		} catch(err) {
			console.log(err);
			await ctx.msg.reply(`:grimacing: sorry, something went wrong`);
		}
	});
	if (!Config.debug) {
		const reportChannel = cli.getTextChannel(Config.reportChannelId);
		await reportChannel.sendTextMessage(`I'm online from \`${Config.instance}\``);
	}
};

init().then(() => console.log('Client ready')).catch(console.error);
