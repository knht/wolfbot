const WolfConfig = require('../config/wolfbot.config');
const WolfConstants = require('../constants/All');
const Chariot = require('chariot.js');
const TwitchPS = require('twitchps');

/**
 * Main bot class for WolfBot
 * @extends Chariot#Client The bot client
 */
class WolfBot extends Chariot.Client {
    constructor() {
        super(
            new Chariot.Config(
                WolfConfig.token,
                WolfConfig.commandDir,
                WolfConfig.chariotConfig,
                WolfConfig.erisConfig
            )
        );

        this.announcementChannel;
        this.loggingChannel;

        this.twitchPStopics = [{ topic: `video-playback.${WolfConfig.twitchName}` }];
        this.pubSub         = new TwitchPS({ init_topics: this.twitchPStopics, reconnect: true, debug: false });
        this.logger         = Chariot.Logger;
        this.constants      = WolfConstants;

        this._initialize();
        this._initializeLogger();
    }

    /**
     * Run main initializer upon becoming fully ready, including setting playing title and calling the Twitch PubSub initializer
     */
    _initialize() {
        this.on('ready', () => {
            this.announcementChannel = this.guilds.get(WolfConfig.guild).channels.get(WolfConfig.announcementChannel);
            this.loggingChannel = this.guilds.get(WolfConfig.guild).channels.get(WolfConfig.loggingChannel);
            this.editStatus('online', { name: 'in the Snow', type: 0 });
            this._initializeTwitchPubSub();
        });
    }

    /**
     * Initialize Twitch PubSub listeners
     */
    _initializeTwitchPubSub() {
        this.pubSub.on('connected', () => {
            this.logger.log(0, 'TWITCH PS', 'Successfully connected to Twitch PubSub services!');
        });

        this.pubSub.on('stream-up', (data) => {
            if (data.channel_name === WolfConfig.twitchName) {
                this.announcementChannel.createMessage(`WubWoofWolf is now live on Twitch! https://www.twitch.tv/${WolfConfig.twitchName}`);
                this.logger.log(0, 'TWITCH PS', 'WubWoofWolf just went live!');
            }
        });
    }

    /**
     * Initialize all logging functionality
     */
    _initializeLogger() {
        this.on('messageDelete', (message) => {
            if (message.author.bot) return;
            if (message.channel.guild.id !== WolfConfig.guild) return;

            const notificationMessage = new Chariot.RichEmbed().setColor('RED').setTitle('Message Delete');

            if (!message.author || !message.content) {
                notificationMessage.setDescription(`An **uncached** message has been deleted!`);
                notificationMessage.addField(`Message ID`, message.id, true);
                notificationMessage.addField(`Channel`, `<#${message.channel.id}>`, true);
            } else {
                notificationMessage.setDescription(`A user's message got deleted`);
                notificationMessage.addField('User', `**${message.author.username}#${message.author.discriminator}** *(ID: ${message.author.id})*`, true);
                notificationMessage.addField('Channel', `<#${message.channel.id}>`, true);
                notificationMessage.addField('Original Message', message.content, false);
                notificationMessage.setThumbnail(message.author.dynamicAvatarURL('jpg', 256));
            }

            this.loggingChannel.createEmbed(notificationMessage);
        });

        this.on('messageUpdate', (newMessage, oldMessage) => {
            if (newMessage.channel.guild.id !== WolfConfig.guild) return;
            if (!newMessage.editedTimestamp) return;

            const notificationMessage = new Chariot.RichEmbed().setColor('RED').setTitle('Message Edit');

            if (oldMessage === null) {
                notificationMessage.setDescription('An **uncached** message has been edited! Fields may or may not be empty.');
                notificationMessage.addField('Message ID', newMessage.id, true);
                notificationMessage.addField('Channel', `<#${newMessage.channel.id}>`, true);
                notificationMessage.addField('Old Message', `Can't be retrieved`, false);
                notificationMessage.addField('New Message', (newMessage.content) ? newMessage.content : `Can't be retrieved`, false);
            } else {
                notificationMessage.setDescription('An **uncached** message has been edited! Fields may or may not be empty.');
                notificationMessage.addField('Message ID', newMessage.id, true);
                notificationMessage.addField('Channel', `<#${newMessage.channel.id}>`, true);
                notificationMessage.addField('User', `**${newMessage.author.username}#${newMessage.author.discriminator}** *(ID: ${newMessage.author.id})*`, false);
                notificationMessage.addField('Old Message', (oldMessage.content) ? oldMessage.content : `Can't be retrieved`, false);
                notificationMessage.addField('New Message', (newMessage.content) ? newMessage.content : `Can't be retrieved`, false);
                notificationMessage.setThumbnail(newMessage.author.dynamicAvatarURL('jpg', 256));
            }

            this.loggingChannel.createEmbed(notificationMessage);
        });
    }
}

module.exports = WolfBot;