const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const winston = require('winston');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const TOKEN = process.env.DISCORD_TOKEN;

// Configureer het logboekbestand
const logger = winston.createLogger({
  level: 'info', // Stel het logboekniveau in op 'info', maar je kunt dit aanpassen aan je behoeften.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'bot.log' }), // Dit is het bestand waarin de loggegevens worden opgeslagen.
  ],
});

client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  logger.info(`Received message: ${message.content}`);
  
  if (message.content === '!ping') {
    logger.info('!ping command received.');
    message.reply('Pong!');
  }
});

client.login(TOKEN);
