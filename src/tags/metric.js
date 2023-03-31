import Tags from '../lib/commands/Tags.js';

Tags.add({
	name: 'metric',
	hasArg: false,
	description: 'Uses metric system',
	handler: (ctx) => ctx.lengthUnit = ctx.lengthUnit.metric(),
});
