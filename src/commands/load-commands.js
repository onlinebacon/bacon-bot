const { REST, Routes } = require('discord.js');
const Config = require('../config.js');
const fs = require('fs');
const path = require('path');

const guildId = '514957494427189258';
const botId = '867142878349492225';

module.exports = async (client) => {
	const dir = path.join(__dirname, 'command-list');

	const commands = fs.readdirSync(dir).map(name => {
		const pathname = path.join(dir, name);
		return require(pathname);
	});

	const rest = new REST({ version: '10' }).setToken(Config.token);

	await rest.put(
		Routes.applicationGuildCommands(botId, guildId),
		{ body: commands },
	);

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isChatInputCommand()) {
			return;
		}
		const name = interaction.commandName;
		const command = commands.find(command => command.name === name);
		if (command !== null) {
			await command.run(interaction);
		}
	});
	
	console.log('Commands loaded');
};
