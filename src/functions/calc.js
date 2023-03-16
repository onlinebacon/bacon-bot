import calc from '../lib/calc/calc.js';

const flagRegex = /^#\w+/;

export const init = (cli) => {
    cli.onMessage(async (msg) => {
        const text = msg.getText();
        if (!/^\.calc\s/.test(text)) return;
        let expr = text.replace(/^[^\s]+\s+/, '');
        const config = {
            flags: {},
        };
        while (flagRegex.test(expr)) {
            let [ flag ] = expr.match(flagRegex) ?? [];
            if (!flag) break;
            expr = expr.substring(flag.length).trim();
            flag = flag.substring(1).trim();
            switch (flag) {
                case 'rad':
                    config.flags.radians = 1;
                break;
                case 'miles':
                    config.flags.length_unit = 1609.344;
                break;
                default:
                    await msg.reply(`Unrecognized flag "${flag}"`);
                return;
            }
        }
        expr = expr.replace(/\s*`\s*(.*?)\s*`\s*/, '$1');
        try {
            const res = calc(expr, config);
            await msg.reply('answer: `' + res + '`');
        } catch(err) {
            console.error(err);
            await msg.reply('Error');
        }
    });
};
