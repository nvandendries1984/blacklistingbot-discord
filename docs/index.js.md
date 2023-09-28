# Discord Bot met Slash-commando's en MySQL-integratie

Dit Markdown-document bevat documentatie voor de gegeven Node.js-code, die een Discord-bot implementeert met slash-commando's en integratie met een MySQL-database.

## Vereiste bibliotheken

De code maakt gebruik van verschillende externe bibliotheken, die aan het begin van het script worden geïmporteerd:

- `discord.js`: Een bibliotheek voor het werken met de Discord API.
- `@discordjs/rest`: Een bibliotheek voor het beheren van Discord REST-aanroepen.
- `discord-api-types/v9`: Typedefinities voor Discord API.
- `dotenv`: Een bibliotheek voor het laden van omgevingsvariabelen uit een `.env`-bestand.
- `winston`: Een logger voor het bijhouden van gebeurtenissen en fouten.
- `@discordjs/builders`: Een hulpmiddel voor het bouwen van slash-commando's.
- `mysql2`: Een bibliotheek voor het werken met MySQL-databases.

## Configuratie

De code leest verschillende configuratievariabelen uit een `.env`-bestand, waaronder Discord-token, database-instellingen en logging-instellingen.

## Logger-configuratie

Een logger wordt geconfigureerd met behulp van de `winston`-bibliotheek om logbestanden te maken en logniveaus in te stellen, afhankelijk van de waarde van `LOGGING_ENABLED` uit de omgevingsvariabelen.

## Discord-client initialisatie

Een Discord-bot-client wordt geïnitialiseerd met enkele vereiste intenties en configuratie-informatie.

## Databaseverbindingenpool

Een MySQL-databaseverbindingenpool wordt gemaakt met behulp van de `mysql2`-bibliotheek om verbindingen met de database te beheren.

## Slash-commando's

Twee slash-commando's worden gedefinieerd met behulp van `SlashCommandBuilder` en geconverteerd naar JSON-objecten.

## Commando-registratie

De slash-commando's worden geregistreerd bij Discord met behulp van de Discord REST API via de `@discordjs/rest`-bibliotheek.

## Discord-cliëntgebeurtenissen

- `ready`: Een gebeurtenis die wordt geactiveerd wanneer de bot succesvol is ingelogd op Discord.
- `interactionCreate`: Een gebeurtenis die wordt geactiveerd wanneer er een interactie plaatsvindt, zoals het gebruik van een slash-commando.

## Slash-commando-handler

Binnen de `interactionCreate`-gebeurtenis worden de binnengekomen interacties verwerkt. Als het een slash-commando is, wordt de naam en de opties ervan geëxtraheerd.

- Het `ping`-commando antwoordt met "Pong!".
- Het `check`-commando controleert of een gebruikersnaam in de database aanwezig is door een query naar de database uit te voeren.

## Bot-start

Tenslotte wordt de bot ingelogd met behulp van de Discord-token die eerder is geconfigureerd.

Dit is een algemene uitleg van de code. Raadpleeg de code en opmerkingen in de code voor meer specifieke details en implementatiedetails.

## Development team
* Niels van den Dries - Niels@nvandendries.nl