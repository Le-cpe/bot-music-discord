const { Client, IntentsBitField, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei"); // Importer l'extracteur

const client = new Client({ intents: new IntentsBitField(53608447) });
const loadCommands = require("./loaders/loadCommands");
const loadEvents = require("./loaders/loadEvents");
require("dotenv").config();

client.commands = new Collection();
client.prefixCommands = new Map();
client.voiceConnections = new Map();
client.musicPanels = new Map(); // Ajouter cette ligne

client.player = new Player(client, {
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

// Enregistrer l'extracteur YouTubei
client.player.extractors.register(YoutubeiExtractor, {});

(async () => {
    await loadCommands(client);
    await loadEvents(client);
    await client.login(process.env.TOKEN);
})();
