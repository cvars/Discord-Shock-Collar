const { Client } = require('discord.js-selfbot-v13');
const { sendData } = require('./serial_handler');
const fs = require('fs').promises;
require('dotenv').config();

const client = new Client({ checkUpdate: false });
let lastTransmitTime = 0;

// Define command prefix and admin ID
const COMMAND_PREFIX = '.';
const ADMIN_ID = '';

// Load user list from files asynchronously
let userList = [];

(async () => {
    userList = await loadData('userList.data') || [];
})();

// Function to save data to a .data file
async function saveData(filename, data) {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    log('info', `Data saved to ${filename}`);
}

// Function to format time as HH:mm:ss
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toTimeString().split(' ')[0]; // HH:mm:ss
}

// Function to load data from a .data file asynchronously
async function loadData(filename) {
    try {
        const data = await fs.readFile(filename, 'utf-8');
        log('info', `Data loaded from ${filename}`);
        return JSON.parse(data);
    } catch (error) {
        log('error', `Failed to load data from ${filename}: ${error.message}`);
        return null;
    }
}

// Function to send a keep-alive signal
function sendKeepAlive() {
    try {
        sendData(1, 1, 0);
    } catch (error) {
        log('error', 'Failed to send keep-alive signal: ' + error.message);
    }
}

client.on("ready", () => {
    log('info', `Logged in as ${client.user.tag}`);
    setInterval(sendKeepAlive, 10000);
});

// Function to handle admin commands
function handleAdminCommands(command, args, message) {
    log('info', `Handling admin command: ${command} with args: ${args.join(', ')}`);

    if (command === 'add' && args.length === 2) {
        addUser(args[1], message.author.username, message);
    } else if (command === 'remove' && args.length === 2) {
        removeUser(args[1], message.author.username, message);
    } else {
        message.reply('Invalid command or missing user ID.');
    }
}

// Function to add a user
function addUser(userIdToAdd, userTagToAdd, message) {
    if (!userList.includes(userIdToAdd)) {
        userList.push(userIdToAdd);
        saveData('userList.data', userList);
        message.reply(`User ${userIdToAdd} added to authorized list.`);
        log('info', `Added ${userIdToAdd} to authorized user list.`);
    } else {
        message.reply(`User ${userIdToAdd} is already authorized.`);
        log('info', `User ${userIdToAdd} is already authorized.`);
    }
}

// Function to remove a user
function removeUser(userIdToRemove, userTagToRemove, message) {
    userList = userList.filter(id => id !== userIdToRemove);
    saveData('userList.data', userList);
    message.reply(`User ${userIdToRemove} removed from authorized list.`);
    log('info', `Removed ${userIdToRemove} from authorized user list.`);
}

// Function to check authorization
function checkAuthorization(message) {
    const isAuthorized = userList.includes(message.author.id) || message.author.id === ADMIN_ID;
    if (!isAuthorized) {
        message.reply(`Unauthorized access attempt by ${message.author.id}`);
        log('warn', `Unauthorized access attempt by ${message.author.id}`);
    }
    return isAuthorized; // Return authorization status
}

// Function to handle shock and buzz commands
function handleShockAndBuzz(command, message) {
    const currentTime = Date.now();
    if (command === 'shock' || command === 'buzz') {
        if (currentTime - lastTransmitTime >= 120000) {
            try {
                if (command === 'shock') {
                    sendData(1, 1, 1);
                    message.reply('*shock*');
                    log('info', `${message.author.username} used *shock*`);
                } else if (command === 'buzz') {
                    sendData(2, 5, 1);
                    message.reply('*Buzz*');
                    log('info', `${message.author.username} used *Buzz*`);
                }
                lastTransmitTime = currentTime;
            } catch (error) {
                message.reply('Error in sending data.');
                log('error', 'Failed to send data: ' + error.message);
            }
        } else {
            const remainingTime = Math.ceil((120000 - (currentTime - lastTransmitTime)) / 1000);
            message.reply(`You must wait ${remainingTime} more seconds before using this command.`);
            log('warn', `User ${message.author.username} must wait ${remainingTime} more seconds before using the command.`);
        }
    }
}

// General logging function
function log(level, message) {
    const timestamp = formatTime(Date.now());
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

// Message create event with command check before authorization
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(COMMAND_PREFIX) || message.channel.type !== 'DM') return;

    const args = message.content.slice(COMMAND_PREFIX.length).trim().split(/ +/);
    const command = args[0].toLowerCase();

    // Define valid commands
    const validCommands = ['add', 'remove', 'shock', 'buzz'];

    if (!validCommands.includes(command)) return;

    if (!checkAuthorization(message)) return;

    if (['add', 'remove'].includes(command) && message.author.id === ADMIN_ID) {
        handleAdminCommands(command, args, message);
    } else if (['shock', 'buzz'].includes(command)) {
        handleShockAndBuzz(command, message);
    }
});

// Start the client
client.login(process.env.BOT_TOKEN);
