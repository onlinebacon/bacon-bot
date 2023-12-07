import { REST, Routes } from "discord.js";
import { config } from "../config.js";
import { commandList } from "./command-list.js";

export const loadCommands = async ({
	client,
	server,
}) => {
	const rest = new REST({ version: '10' }).setToken(config.token);

	await rest.put(
		Routes.applicationGuildCommands(config.botId, server.id),
		{ body: commandList },
	);

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isChatInputCommand()) {
			return;
		}
		const name = interaction.commandName;
		const command = commandList.find(command => command.name === name);
		if (command !== null) {
			try {
				await command.run(interaction);
			} catch (err) {
				console.error(err);
			}
		}
	});
	
	console.log(`Commands loaded in '${server.name}' server`);
};
