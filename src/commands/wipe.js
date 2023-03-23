import Commands from '../lib/commands.js';

Commands.add('wipe')
.setHandler(async (msg, args) => {
    const count = args ? Number(args) + 1 : Infinity;
    const channel = msg.getChannel();
    await channel.wipe(count);
});
