const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "autorisation",
    description: "Envoyer un message d'alerte au propriétaire d'un serveur concernant les permissions du bot.",
    
    async run(client, message, args) {
        // Vérifie si l'ID du serveur est fourni
        if (!args.length) {
            return message.reply("Merci de fournir l'ID du serveur.");
        }

        const serverId = args[0]; // Récupère l'ID du serveur

        // Vérifie si le serveur existe
        const guild = client.guilds.cache.get(serverId);
        if (!guild) {
            return message.reply(`Le serveur avec l'ID \`${serverId}\` n'a pas été trouvé.`);
        }

        try {
            // Récupérer le propriétaire du serveur
            const owner = await guild.fetchOwner();

            // Créer l'embed d'alerte
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("🚨 Alerte de Permissions 🚨")
                .setDescription(`**⚠️ Attention !**\nLe bot ne dispose pas des permissions administratives sur le serveur **${guild.name}** (ID: ${serverId}).\n\nCela peut affecter son fonctionnement.`)
                .setTimestamp();

            // Envoyer le message au propriétaire en privé
            await owner.send({ embeds: [embed] });
            await message.reply(`Votre alerte a été envoyée avec succès au propriétaire du serveur **${guild.name}**.`);
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'alerte au propriétaire: ${error}`);
            await message.reply("Impossible d'envoyer un message au propriétaire du serveur.");
        }
    },
};
