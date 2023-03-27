import Config from './config.js';
import { Client, IntentsBitField } from 'discord.js';
import * as Scheduler from './lib/scheduler.js';
import ClientAdapter from './wrappers/client-wrapper.js';

import * as ImNele from './functions/im-nele.js';
import * as Instances from './functions/instances.js';
import * as Disconnect from './functions/disconnect.js';
import * as Calc from './functions/calc.js';
import * as GetGP from './functions/get-gp.js';
import * as CorrectAlt from './functions/correct-alt.js';

import './commands/wipe.js';
import './commands/get-gp-rep.js';
import './commands/az-alt.js';

import Commands from './lib/commands.js';

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
	await Scheduler.init();
	Instances.init(cli);
	ImNele.init(cli);
	Disconnect.init(cli);
	Calc.init(cli);
	GetGP.init(cli);
	CorrectAlt.init(cli);
	cli.onMessage(async (msg) => {
		try {
			await Commands.handleMessage(msg);
		} catch(err) {
			console.log(err);
			await msg.reply(`:grimacing: sorry, something went wrong`);
		}
	});
	const reportChannel = cli.getTextChannel(Config.reportChannelId);
	await reportChannel.sendTextMessage(`I'm online from \`${Config.instance}\``);
};

init()
.then(() => console.log('Client ready'))
.catch(console.error);
