const Chariot = require('chariot.js');

class Keyboard {
    constructor() {
        this.name = 'keyboard';
        this.aliases = ['kb'];
        this.owner = false;
    }

    async execute(message, args, chariot) {
        message.channel.createEmbed(new Chariot.RichEmbed()
            .setColor('RED')
            .setAuthor('The Glorious GMMK with Gateron Blue switches', chariot.constants.IMAGES.GLORIOUS)
        );

        Chariot.Logger.log(0, this.name.toUpperCase(), `${message.author.username} used the ${this.name} command!`);
    }
}

module.exports = new Keyboard();