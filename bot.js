// Importeer de benodigde modules
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Laad de .env-variabelen

// Maak een nieuwe Discord-client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Haal het bot-token op uit het .env-bestand
const TOKEN = process.env.DISCORD_TOKEN;

// Event-handler voor wanneer de bot is ingelogd
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event-handler voor berichten die de bot ontvangt
client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// Log de bot in met het opgehaalde token
client.login(TOKEN);
