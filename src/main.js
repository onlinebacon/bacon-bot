import Config from './config.js';
import { Client, IntentsBitField } from 'discord.js';
import './api/main.js';
import * as Scheduler from './shared/scheduler.js';
import ClientAdapter from './wrappers/client-wrapper.js';

import * as ImNele from './functions/im-nele.js';
import * as Wipe from './functions/wipe.js';
import * as Instances from './functions/instances.js';
import * as Disconnect from './functions/disconnect.js';
import * as Calc from './functions/calc.js';
import * as Trilaterate from './functions/trilaterate.js';

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
	Wipe.init(cli);
	Instances.init(cli);
	ImNele.init(cli);
	Disconnect.init(cli);
	Calc.init(cli);
	Trilaterate.init(cli);
};

init()
.then(() => console.log('Client ready'))
.catch(console.error);
