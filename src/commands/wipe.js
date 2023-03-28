import Commands from '../lib/commands/Commands.js';

Commands.add({
	name: 'x',
	description: 'Deletes messages from a text channel',
	syntax: '.wipe [COUNT]',
	examples: [
		'.wipe',
		'.wipe 14',
	],
	handler: async function({ ctx, args }) {
		const count = args ? Number(args) + 1 : Infinity;
		if (isNaN(count)) {
			return this.handleBadSyntax(ctx);
		}
		return ctx.msg.getChannel().wipe(count);
	},
});
