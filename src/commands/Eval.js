const Chariot = require('chariot.js');

class Eval {
    constructor() {
        this.name = 'eval';
        this.aliases = [];
        this.owner = true;
    }

    sanitize(text) {
        if (typeof(text) === "string") {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else {
            return text;
        }
    }

    async execute(message, args, WolfBot) {
        try {
            let evaled = await eval(args.join(' '));

            if (typeof evaled !== "string") {
                evaled = require('util').inspect(evaled);
            }

            message.channel.createCode(this.sanitize(evaled), "js");
        } catch (evalError) {
            message.channel.createCode(this.sanitize(evalError), "js");
        }
    }
}

module.exports = new Eval();