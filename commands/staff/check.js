const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "check",
    description: "Vérifier sur quels serveurs le bot n'a pas les permissions administratives.",

    async run(client, message) {
        const guildsWithoutPermissions = []; // Tableau pour stocker les guildes sans permissions admin

        // Parcourir les guildes où le bot est membre
        client.guilds.cache.forEach(guild => {
            const botMember = guild.members.me; // Récupérer l'objet membre du bot

            // Vérifier si le bot a les permissions administratives
            if (!botMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                guildsWithoutPermissions.push(`**${guild.name}** (ID: ${guild.id})`); // Ajouter à la liste
            }
        });

        // Créer l'embed pour afficher les résultats
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("🔍 Vérification des Permissions 🔍")
            .setDescription("Voici la liste des serveurs où le bot n'a pas les permissions administratives:")
            .setTimestamp();

        // Si le bot a des permissions sur tous les serveurs
        if (guildsWithoutPermissions.length === 0) {
            embed.setDescription("✅ Le bot a les permissions administratives sur tous les serveurs.");
        } else {
            embed.addFields({ name: "Serveurs sans permissions administratives", value: guildsWithoutPermissions.join("\n") });
        }

        // Envoyer l'embed dans le channel
        await message.reply({ embeds: [embed] });
    },
};
