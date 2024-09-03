const { Events, InteractionType } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {

        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                await command.run(interaction);
            }
        }

        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            if (interaction.commandName === "play") {
                try {
                    const focusedValue = interaction.options.getFocused();
                    const resultsSpotify = await client.player.search(focusedValue, { searchEngine: QueryType.SPOTIFY_SEARCH });
                    const resultsYouTube = await client.player.search(focusedValue, { searchEngine: QueryType.YOUTUBE });

                    const tracksSpotify = resultsSpotify.tracks.slice(0, 5).map((track) => ({
                        name: `Spotify: ${`${track.title} - ${track.author}`.length > 75 ? `${`${track.title} - ${track.author}`.substring(0, 75)}...` : `${track.title} - ${track.author}`}`,
                        value: track.url
                    }));

                    const tracksYouTube = resultsYouTube.tracks.slice(0, 5).map((track) => ({
                        name: `YouTube: ${`${track.title} - ${track.author}`.length > 75 ? `${`${track.title} - ${track.author}`.substring(0, 75)}...` : `${track.title} - ${track.author}`}`,
                        value: track.url
                    }));

                    const tracks = [...tracksSpotify, ...tracksYouTube];

                    // Si aucun track n'est trouvé, envoyer un message d'erreur au lieu de faire un respond
                    if (tracks.length === 0) {
                        await interaction.respond([{ name: "No results found", value: "no_results" }]);
                    } else {
                        await interaction.respond(tracks);
                    }
                } catch (err) {
                    console.error(`[Autocomplete ERROR] - ${interaction.commandName}`, err);
                    await interaction.respond([{ name: "Error occurred", value: "error_occurred" }]);
                }
            }
        }
    }
};
