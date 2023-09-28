const { Client, GatewayIntentBits, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const winston = require('winston');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql2');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'bot.log' }),
  ],
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_TABLE = process.env.DB_TABLE;
const DB_COLUMN = process.env.DB_COLUMN;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    logger.error('Fout bij verbinden met de database: ', err);
    return;
  }
  logger.info('Verbonden met de database.');
});

const commands = [
  new SlashCommandBuilder()
    .setName('check')
    .setDescription('Controleert of een gebruikersnaam in de database staat')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('De gebruikersnaam om te controleren')
        .setRequired(true)),
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

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'check') {
    const username = options.getString('username');

    // Controleer of de databaseverbinding open is; zo niet, open deze opnieuw.
    if (db.state === 'disconnected') {
      db.connect((err) => {
        if (err) {
          console.error('Fout bij verbinden met de database: ', err);
          interaction.reply('Er is een fout opgetreden bij het controleren van de gebruikersnaam.');
          return;
        }
        executeQuery();
      });
    } else {
      executeQuery();
    }

    function executeQuery() {
      // Voer een databasequery uit om de gebruikersnaam te controleren
      db.query(`SELECT * FROM ${DB_TABLE} WHERE ${DB_COLUMN} = ?`, [username], (err, results) => {
        if (err) {
          console.error('Fout bij databasequery: ', err);
          interaction.reply('Er is een fout opgetreden bij het controleren van de gebruikersnaam.');
          return;
        }

        if (results.length > 0) {
          interaction.reply('De gebruikersnaam is gevonden in de database.');
        } else {
          interaction.reply('De gebruikersnaam is niet gevonden in de database.');
        }
      });
    }
  }
});


client.login(TOKEN);
