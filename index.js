const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const winston = require('winston');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql2');

// Lees de waarde van LOGGING_ENABLED
const LOGGING_ENABLED = process.env.LOGGING_ENABLED === 'true';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: LOGGING_ENABLED ? [new winston.transports.File({ filename: 'bot.log' })] : [],
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

// Maak een databaseverbindingenpool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 10, // Aantal gelijktijdige verbindingen
});

const commands = [
  new SlashCommandBuilder()
    .setName('check')
    .setDescription('Checks whether a username is in the database')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('The username to check')
        .setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

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
  
      // Gebruik de databaseverbindingenpool om een verbinding te verkrijgen
      pool.getConnection((err, connection) => {
        if (err) {
          logger.error('Error getting a database connection: ', err);
          interaction.reply('An error occurred while checking the username.');
          return;
        }
  
        // Voer een databasequery uit om de gebruikersnaam hoofdlettergevoelig te controleren
        connection.query(`SELECT * FROM ${DB_TABLE} WHERE BINARY ${DB_COLUMN} = ?`, [username], (queryErr, results) => {
          // Geef de verbinding vrij voordat je reageert op de interactie
          connection.release();
  
          if (queryErr) {
            logger.error('Database query error: ', queryErr);
            interaction.reply('An error occurred while checking the username.');
            return;
          }
  
          if (results.length > 0) {
            interaction.reply('The username was found in the database.');
          } else {
            interaction.reply('The username was not found in the database.');
          }
        });
      });
    }
  });

client.login(TOKEN);
