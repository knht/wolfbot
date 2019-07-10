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

        this.twitchPStopics = [{ topic: `video-playback.${WolfConfig.twitchName}` }];
        this.pubSub         = new TwitchPS({ init_topics: this.twitchPStopics, reconnect: true, debug: false });
        this.logger         = Chariot.Logger;
        this.constants      = WolfConstants;
        this._initialize();
    }

    /**
     * Run main initializer upon becoming fully ready, including setting playing title and calling the Twitch PubSub initializer
     */
    _initialize() {
        this.on('ready', () => {
            this.announcementChannel = this.guilds.get(WolfConfig.guild).channels.get(WolfConfig.announcementChannel);
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
}

module.exports = WolfBot;