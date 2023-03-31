import Tags from '../lib/commands/Tags.js';

Tags.add({
	name: 'gp',
	hasArg: true,
	description: 'Uses either +/- symbols or N/S and E/W for coordinates',
	examples: [
		'[gp:nsew]',
		'[gp:+-]',
	],
	handler: (ctx, arg) => {
		switch (arg) {
			case 'nsew':
				ctx.latLon = ctx.latLon.nsew();
			return true;
			case '+-':
				ctx.latLon = ctx.latLon.plmn();
			return true;
		}
		return false;
	},
});
