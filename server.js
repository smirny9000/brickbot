// ### load packages
require('dotenv').config();
const tmi = require('tmi.js');
const axios = require('axios').default;


// ### define vars
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const api_path = "https://rebrickable.com/api/v3/lego/";


// ### define twitch client
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


// ### listen to twitch chat
client.on('message', (channel, tags, message, self) => {
    if(message[0] === "!" && !(self)) {

        const [raw, command, arg] = message.match(regexpCommand);

        if(command === "set") {
            axios.get(api_path + '/sets/' + arg + '-1', {
                params: { key: process.env.REBRICKABLE_API_KEY }
            })
            .then(function (r) {
                if(r.status === 200) {
                    let set = r.data;
                    client.say(channel, `${set.name} [${arg}] was released in ${set.year} and has ${set.num_parts} parts! ${set.set_url}`);
                }
            })
            .catch(function (error) {
                client.say(channel, `Sorry, no set ${arg} was found :(`);
            });
        }
    }
});
