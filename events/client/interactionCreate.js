const { Events, InteractionType, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const fs = require("fs");

// Improved logging function with async and levels
const logLevels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
async function logError(level, error) {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] [${level}] ${error.stack || error.message || error}\n`;
    try {
        await fs.promises.appendFile("error.log", errorMessage, "utf8");
    } catch (appendErr) {
        console.error("Failed to append to error log:", appendErr);
    }
}

module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {
        try {
            if (interaction.type === InteractionType.ApplicationCommand) {
                const command = client.commands.get(interaction.commandName);
                if (command) {
                    try {
                        await command.run(interaction);

                        // Log command execution in an embed
                        const logChannelId = "1289937885285322752";
                        const guildName = interaction.guild ? interaction.guild.name : "Direct Message";
                        const guildId = interaction.guild ? interaction.guild.id : "N/A";

                        const embed = new EmbedBuilder()
                            .setTitle("Commande exécutée")
                            .setColor("Blue")
                            .addFields(
                                { name: "Commande", value: `\`${interaction.commandName}\``, inline: true },
                                { name: "Serveur", value: `\`${guildName}\``, inline: true },
                                { name: "ID du Serveur", value: `\`${guildId}\``, inline: true },
                                { name: "Utilisateur", value: `\`${interaction.user.tag}\``, inline: true }
                            )
                            .setTimestamp();

                        const logChannel = client.channels.cache.get(logChannelId);
                        if (logChannel) {
                            await logChannel.send({ embeds: [embed] });
                        } else {
                            console.warn(`Log channel with ID ${logChannelId} not found.`);
                        }
                    } catch (err) {
                        await logError(logLevels.ERROR, err);
                    }
                }
            }

            if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
                if (interaction.commandName === "play") {
                    const focusedValue = interaction.options.getFocused();
                    try {
                        const results = await client.player.search(focusedValue, { searchEngine: QueryType.AUTO });
                        const tracks = results.tracks.slice(0, 10).map((track) => ({
                            name: `${track.title} - ${track.author}`.length > 75
                                ? `${`${track.title} - ${track.author}`.substring(0, 75)}...`
                                : `${track.title} - ${track.author}`,
                            value: track.url
                        }));

                        if (tracks.length === 0) {
                            await interaction.respond([{ name: "No results found", value: "no_results" }]);
                        } else {
                            await interaction.respond(tracks);
                        }
                    } catch (err) {
                        await logError(logLevels.ERROR, err);
                        await interaction.respond([{ name: "An unexpected error occurred. Please try again later.", value: "error_occurred" }]);
                    }
                }
            }
        } catch (err) {
            await logError(logLevels.ERROR, err);
        }
    }
};
