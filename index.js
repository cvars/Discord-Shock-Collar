const { Client } = require('discord.js-selfbot-v13');
const { sendData } = require('./serial_handler');

const client = new Client({ checkUpdate: false });

let lastTransmitTime = 0; // Initialize last transmit time

// Function to send a keep-alive signal
function sendKeepAlive() {
    sendData(1, 1, 0); // Send a keep-alive signal (mode 0, strength 0, duration 0)
}

client.on("ready", () => {
    console.log(`[Ready] Logged in as ${client.user.tag}`);
    setInterval(sendKeepAlive, 10000); // Send a keep-alive signal every 10 seconds
});

client.on('messageCreate', (message) => {
    // Check if the message is in a DM and from the specified author
    if (message.channel.type === 'DM' && message.author.id === '') {
        const content = message.content.toLowerCase();

        // Handle "shock" and "buzz" commands
        if (content === 'shock' || content === 'buzz') {
            const currentTime = Date.now();

            if (currentTime - lastTransmitTime >= 120000) {
                if (content === 'shock') {
                    sendData(1, 1, 1);
                    message.reply('*shock*');
                    console.log('*shock*');
                } else if (content === 'buzz') {
                    sendData(2, 5, 1);
                    message.reply('*Buzz*');
                    console.log('*Buzz*');
                }
                lastTransmitTime = currentTime; // Update the last transmit time
            } else {
                const remainingTime = Math.ceil((120000 - (currentTime - lastTransmitTime)) / 1000);
                message.reply(`You must wait ${remainingTime} more seconds before using this command again.`);
                console.log(`You must wait ${remainingTime} more seconds before using this command again.`);
            }
        }
    }
});

client.login('DISCORD_TOKEN_DO_NOT_SHARE');
