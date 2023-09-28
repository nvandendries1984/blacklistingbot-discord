# Discord bone with slash commands and mysql integration

This Markdown document contains documentation for the given Node.js code, which implements a Discord-Bot with Slash commands and integration with a MySQL database.

## required libraries

The code uses various external libraries, which are imported at the start of the script:

- "Discord.js": a library for working with the Discord API.
- `@Discordjs/Rest`: a library for managing Discord Rest calls.
-`Discord api types/V9`: Type definitions for Discord API.
- `Dotv`: a library for loading environment variables from a '. andv' file.
- `Winston`: a logger for keeping track of events and mistakes.
- `@discordjs/builders`: a tool for building slash commands.
- `MySQL2`: a library for working with MySQL databases.

## Configuration

The code reads various configuration variables from a `. Andv` file, including Discord token, database settings and logging settings.

## Logger-Configuration

A logger is configured with the help of the `Winston" library to create log files and set log levels, depending on the value of 'logging_enabled' from the environment variables.

## Discord client initialization

A Discord-Bot client is initialized with some required intentions and configuration information.

## Database binding pool

A MySQL database binding pool is made using the "MySQL2" library to manage connections to the database.

## slash commands

Two Slash commands are defined with the help of `slash commandbuilder` and converted to JSON objects.

## command registration

The Slash commands are registered with Discord using the Discord Rest API via the `@Discordjs/Rest` library.

## Discord client events

- "Ready": an event that is activated when the bot is successfully logged in to Discord.
- "InteractionCreate": an event that is activated when an interaction takes place, such as the use of a Slash command.

## slash-command handler

The interactions arrived are processed within the 'InteractionCreate' event.If it is a slash command, the name and options are extracted.

- The "Ping" command answers with "Pong!".
- The 'check` command checks whether a username is present in the database by performing a query to the database.

## Bot-Start

Finally, the bone is logged in using the Discord token that has previously been configured.

This is a general explanation of the code.Consult the code and comments in the code for more specific details and implementation details.

## Development Team
* Niels van den Dries - niels@nvandendries.nl