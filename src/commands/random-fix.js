	import { shoot } from '../es6lib/coord.js';
import generateSample from '../lib/celnav/generate-sample.js';
import Commands from '../lib/commands/Commands.js';
import DateTime from '../lib/datetime/DateTime.js';

const maxDRErr = 200/69.09;
const minDRErr = 30/69.09;
const DEG = Math.PI/180;

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
		const drError = Math.random()*(maxDRErr - minDRErr) + minDRErr;
		const drAzm = Math.random()*360;
		const dr = shoot(sample.loc.map(x=>x*DEG), drAzm*DEG, drError*DEG).map(x=>x/DEG);
		let text = '';
		text += `Height of eye: \`${height}\`\n`;
		text += `Index error: \`${index}\`\n`;
		for (let { name, unixtime, alt } of sample.readings) {
			const date = DateTime.stringify(unixtime);
			text += `**${name}**, ${date}, \`${deg.stringify(alt)}\`\n`;
		}
		text += `Dead reckoning: ||\`${ctx.latLon.stringify(dr)}\`||\n`;
		text += `Answer: ||\`${ctx.latLon.stringify(sample.loc)}\` (${deg.stringify(drError)} off the DR)||`;
		return ctx.msg.reply(text);
	},
});
