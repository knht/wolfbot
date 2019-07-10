const Chariot = require('chariot.js');

class Skin {
    constructor() {
        this.name = 'skin';
        this.aliases = [];
        this.owner = false;
    }

    async execute(message, args, chariot) {
        message.channel.createEmbed(new Chariot.RichEmbed()
            .setColor('RED')
            .setAuthor(`Click here to Download my latest osu! Skin!`, chariot.constants.IMAGES.OSU, chariot.constants.LINKS.SKIN)
        );

        Chariot.Logger.log(0, this.name.toUpperCase(), `${message.author.username} used the ${this.name} command!`);
    }
}

module.exports = new Skin();