import Tags from '../lib/commands/Tags.js';

Tags.add({
	name: 'imp',
	hasArg: false,
	description: 'Uses imperial system',
	handler: (ctx) => ctx.lengthUnit = ctx.lengthUnit.imperial(),
});
