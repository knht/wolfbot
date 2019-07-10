const Chariot = require('chariot.js');

class Twitter {
    constructor() {
        this.name = 'twitter';
        this.aliases = [];
        this.owner = false;
    }

    async execute(message, args, chariot) {
        message.channel.createEmbed(new Chariot.RichEmbed()
            .setColor('RED')
            .setAuthor('Click here to follow me on Twitter @WubWoofWolf!', chariot.constants.IMAGES.TWITTER, chariot.constants.LINKS.TWITTER)
        );

        Chariot.Logger.log(0, this.name.toUpperCase(), `${message.author.username} used the ${this.name} command!`);
    }
}

module.exports = new Twitter();