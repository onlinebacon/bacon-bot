import Tags from '../lib/commands/Tags.js';

Tags.add({
	name: 'ang',
	hasArg: true,
	description: 'Changes formating of angles',
	examples: [ '[ang:dec]', '[ang:min]', '[ang:sec]' ],
	handler: (ctx, arg) => {
		switch (arg) {
			case 'dec': ctx.degFormat = ctx.degFormat.decimal(); return true;
			case 'min': ctx.degFormat = ctx.degFormat.arcMins(); return true;
			case 'sec': ctx.degFormat = ctx.degFormat.arcSecs(); return true;
		}
		return false;
	},
});
