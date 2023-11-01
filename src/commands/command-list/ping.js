module.exports.name = 'ping';

module.exports.description = 'Pongs back';

module.exports.run = async (interaction) => {
	await interaction.reply('Pong!');
};
