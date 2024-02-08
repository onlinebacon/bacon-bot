import Commands from '../lib/commands/Commands.js';

const argToUnix = (arg) => {
    arg = arg.replace(/(?<!:)\b\d+$/, d => {
        if (d.length === 1) {
            return `0${d}00`;
        }
        if (d.length === 2) {
            return d + '00';
        }
        return d;
    });
    arg = arg.replace(/\d+:\d+$/, d => d.replace(':', ''));
    arg = arg.replace(/(gmt|utc)([\+\-]\d+)$/i, '$2');
    arg = arg.replace(/\s+/, 'T');
    arg = arg.replace(/\s+/, '');
    return new Date(arg)/1000 | 0;
};

Commands.add({
	name: 't-msg',
	listed: true,
	description: 'Generate discord relative time messages',
	syntax: '.t-msg TIME',
	examples: [ '.t-msg 2024-01-13 08:34:15 -5' ],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 1) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 1) return this.handleBadSyntax(ctx, `Too many arguments`);
        const unix = argToUnix(args[0]);
        if (isNaN(unix)) {
		    return ctx.msg.reply(`Invalid time format`);
        }
        let res = '';
        const add = (type) => {
            let code = `<t:${unix}${type}>`;
            res += `\`${code}\` = ${code}\n`;
        };
        add('');
        'tTdDfFR'.split('').forEach(t => add(':' + t));
		return ctx.msg.reply(res);
	},
});
