const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  console.log(`Received message: ${message.content}`);
  
  if (message.content === '!ping') {
    console.log(`!ping command received.`);
    message.reply('Pong!');
  }
});

client.login(TOKEN);
