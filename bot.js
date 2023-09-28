const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const winston = require('winston');
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

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

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Reageert met Pong!'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error(error);
  }
})();

client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  logger.info(`Received message: "${message.content}"`);
  
  if (message.content === '!ping') {
    logger.info('!ping command received.');
    message.reply('Pong!');
  }
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;
  
  const { commandName } = interaction;
  
  if (commandName === 'ping') {
    logger.info('/ping command received.');
    interaction.reply('Pong!');
  }
});

client.login(TOKEN);
