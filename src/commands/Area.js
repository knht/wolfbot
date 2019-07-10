const Chariot = require('chariot.js');

class Area {
    constructor() {
        this.name = 'area';
        this.aliases = [];
        this.owner = false;
    }

    async execute(message, args, chariot) {
        message.channel.createEmbed(new Chariot.RichEmbed()
            .setColor('RED')
            .setAuthor('Full Area, Force Proportions on a Wacom Intuos CTL - 480', chariot.constants.IMAGES.WACOM)
        );

        Chariot.Logger.log(0, this.name.toUpperCase(), `${message.author.username} used the ${this.name} command!`);
    }
}

module.exports = new Area();