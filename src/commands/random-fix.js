import generateSample from '../lib/celnav/generate-sample.js';
import Commands from '../lib/commands/Commands.js';
import DateTime from '../lib/datetime/DateTime.js';

Commands.add({
	name: 'random-fix',
	listed: true,
	description: 'Randomly generates a set of celestial navigation readings',
	syntax: '.random-fix',
	examples: [
		'.random-fix',
	],
	handler: async function({ ctx, args }) {
		const sample = await generateSample();
		const deg = ctx.degFormat.arcMins();
		const height = ctx.lengthUnit.digits(2).stringify(sample.height);
		const index = deg.stringify(sample.index);
		let text = '';
		text += `Height of eye: \`${height}\`\n`;
		text += `Index error: \`${index}\`\n`;
		for (let { name, unixtime, alt } of sample.readings) {
			const date = DateTime.stringify(unixtime);
			text += `**${name}**, ${date}, \`${deg.stringify(alt)}\`\n`;
		}
		text += `Answer: ||\`${ctx.latLon.stringify(sample.loc)}\`||`;
		return ctx.msg.reply(text);
	},
});
