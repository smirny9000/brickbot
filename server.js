require('dotenv').config();
const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    set: {
        response: (set) => `The ${set} set looks cool!!`
    }
}

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: [ 'smirny9000' ],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    if(message[0] === "!" && !(self)) {

        const [raw, command, arg] = message.match(regexpCommand);
        const {response} = commands[command] || {};

        if(typeof response === 'function') {
            client.say(channel, response(arg));
        }
        else if(typeof response === 'string') {
            client.say(channel, response);
        }
    }
});