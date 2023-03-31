import Tags from '../lib/commands/Tags.js';

Tags.add({
	name: 'ra',
	hasArg: true,
	description: 'Changes formating of right ascension',
	examples: [ '[ra:hr]', '[ang:deg]' ],
	handler: (ctx, arg) => {
		switch (arg) {
			case 'hr': ctx.ra = ctx.ra.hours(); return true;
			case 'deg': ctx.ra = ctx.ra.degrees(); return true;
		}
		return false;
	},
});
