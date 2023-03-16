import calc from '../lib/calc/calc.js';

export const init = (cli) => {
    cli.onMessage(async (msg) => {
        const text = msg.getText();
        if (!/^\.calc\s/.test(text)) return;
        const expr = text.replace(/^[^\s]+\s+/, '');
        try {
            const res = calc(expr);
            await msg.reply('answer: `' + res + '`');
        } catch(err) {
            console.error(err);
            await msg.reply('Error');
        }
    });
};