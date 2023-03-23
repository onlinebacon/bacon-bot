const nameRegex = /^\.\w+(-\w+)*/;
const flagRegex = /^#\w+/;

class Command {
    constructor(name) {
        this._name = name;
        this._handler = async () => {};
        this._split_args = false;
    }
    splitArgs() {
        this._split_args = true;
    }
    setHandler(handler) {
        this._handler = handler;
        return this;
    }
}

const flagDict = {
    miles: [ 'length_unit', 1609.344 ],
    deg: [ 'radians', false ],
    rad: [ 'radians', true ],
};

class CommandManager {
    constructor() {
        this.map = {};
        this.list = [];
    }
    add(name) {
        const command = new Command(name);
        this.map[name] = command;
        this.list.push(command);
        return command;
    }
    async handleMessage(msg) {
        let text = msg.getText();
        let [ name ] = text.match(nameRegex) ?? [];
        if (!name) return;
        name = name.substring(1);
        const cmd = this.map[name];
        if (!cmd) {
            return msg.reply(`Unrecognized command **${name}**`);
        }
        text = text.replace(nameRegex, '').trim();
        const flags = {};
        for (;;) {
            const [ flag ] = text.match(flagRegex) ?? [];
            if (!flag) break;
            text = text.substring(flag.length).trim();
            const name = flag.substring(1);
            const entry = flagDict[name];
            if (!entry) return msg.reply(`Unrecognized flag **${flag}**`);
            const [ key, val ] = entry;
            flags[key] = val;
        }
        const args = cmd._split_args ? text ? [] : text.split(/\s*,\s*/) : text;
        try {
            await cmd._handler(msg, args, flags);
        } catch(err) {
            console.error(err);
            await msg.reply(`:grimacing: sorry, something went wrong`);
        }
    }
}

const Commands = new CommandManager();

export default Commands;
