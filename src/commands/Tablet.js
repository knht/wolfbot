const Chariot = require('chariot.js');

class Tablet {
    constructor() {
        this.name = 'tablet';
        this.aliases = ['pen', 'mouse'];
        this.owner = false;
    }

    async execute(message, args, chariot) {
        message.channel.createEmbed(new Chariot.RichEmbed()
            .setColor('RED')
            .setAuthor('Wacom Intuos CTL - 480 Pen Small', chariot.constants.IMAGES.WACOM)
        );

        Chariot.Logger.log(0, this.name.toUpperCase(), `${message.author.username} used the ${this.name} command!`);
    }
}

module.exports = new Tablet();