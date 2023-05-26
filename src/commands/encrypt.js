import Commands from '../lib/commands/Commands.js';
import { encrypt, decrypt, checkSum } from '../lib/pwd-encryption/pwd-encryption.js';

Commands.add({
	name: 'encrypt',
	listed: false,
	description: 'Encrypt a text',
	syntax: '.encrypt TEXT, PASSWORD',
	examples: [ '.encrypt secret-thing, batman123' ],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 2) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 2) return this.handleBadSyntax(ctx, `Too many arguments`);
		const [ text, password ] = args;
		await ctx.msg.reply(`**Encrypted**: \`\`\`${encrypt(text, password)}\`\`\``);
		await ctx.msg.remove();
	},
});

Commands.add({
	name: 'decrypt',
	listed: false,
	description: 'Decrypt a decrypted text',
	syntax: '.decrypt ENCRYPTED, PASSWORD',
	examples: [ '.decrypt a713ed/9d2dbbf0ef0342a0624aa95b-82, batman123' ],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 2) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 2) return this.handleBadSyntax(ctx, `Too many arguments`);
		const [ encrypted, password ] = args;
		if (!checkSum(encrypted)) {
			return ctx.msg.reply(`**Error**: checksum doesn't match`);
		}
		return ctx.msg.reply(`**Decrypted**: \`\`\`${decrypt(encrypted, password)}\`\`\``);
	},
});
