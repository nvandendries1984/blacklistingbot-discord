const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const winston = require('winston');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql2');
const path = require('path');

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
  transports: LOGGING_ENABLED ? [new winston.transports.File({ filename: path.resolve(__dirname, 'bot.log') })] : [],
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Discord settings
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

// Database settings
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
  .setName('info')
  .setDescription('Replies with information!'),
  new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!'),
  new SlashCommandBuilder()
    .setName('check')
    .setDescription('Checks whether a username is in the database')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('The username to check')
        .setRequired(true)),
  new SlashCommandBuilder() // Voeg het nieuwe slash-commando toe
  .setName('blacklistuser')
  .setDescription('Blacklist a user')
  .addStringOption(option =>
    option.setName('username')
      .setDescription('The username to blacklist')
      .setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID), // Dit registreert slash-commando's op de globale toepassing
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

    // begin info command
    if (commandName === 'info') {
      // Beantwoord met een eenvoudig bericht
      await interaction.reply('https://blacklistingbot.com/');
    }
    
    // begin ping command
    if (commandName === 'ping') {
      // Beantwoord met een eenvoudig bericht
      await interaction.reply('Pong, Bitch!');
    }

    // begin blacklist command
    if (commandName === 'blacklistuser') {
      const username = options.getString('username');
    
      // Gebruik de databaseverbindingenpool om een verbinding te verkrijgen
      pool.getConnection((err, connection) => {
        if (err) {
          logger.error('Fuck!!, Error getting a database connection: ', err);
          interaction.reply('Fuck!!, An error occurred while processing the command.');
          return;
        }
    
        // Voer een databasequery uit om de gebruikersnaam op te slaan in de database
        connection.query(`INSERT INTO ${DB_TABLE} (${DB_COLUMN}) VALUES (?)`, [username], (queryErr) => {
          // Geef de verbinding vrij voordat je reageert op de interactie
          connection.release();
    
          if (queryErr) {
            logger.error('Database query error: ', queryErr);
            interaction.reply('Fuck!!, An error occurred while processing the command.');
            return;
          }
    
          interaction.reply(`User '${username}' has been blacklisted.`);
        });
      });
    }
  
    // begin check command
    if (commandName === 'check') {
      const username = options.getString('username');
  
      // Gebruik de databaseverbindingenpool om een verbinding te verkrijgen
      pool.getConnection((err, connection) => {
        if (err) {
          logger.error('Fuck!!, Error getting a database connection: ', err);
          interaction.reply('Fuck!!, An error occurred while checking the username.');
          return;
        }
  
        // Voer een databasequery uit om de gebruikersnaam hoofdlettergevoelig te controleren
        connection.query(`SELECT * FROM ${DB_TABLE} WHERE BINARY ${DB_COLUMN} = ?`, [username], (queryErr, results) => {
          // Geef de verbinding vrij voordat je reageert op de interactie
          connection.release();
  
          if (queryErr) {
            logger.error('Database query error: ', queryErr);
            interaction.reply('Fuck!!, An error occurred while checking the username.');
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
