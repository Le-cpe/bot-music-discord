const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'demande',
    async run(client, message, args) {
        if (message.author.bot) return;

        // Vérifie si l'utilisateur a fourni un ID de serveur et une raison
        const guildId = args[0];
        const raison = args.slice(1).join(' ');

        if (!guildId || !raison) {
            return message.reply('Veuillez fournir un ID de serveur et une raison pour votre demande.');
        }

        // Récupère le serveur par son ID
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) {
            return message.reply('Serveur introuvable. Vérifiez l\'ID et essayez à nouveau.');
        }

        // Récupère le propriétaire du serveur
        const owner = await guild.fetchOwner().catch(() => null);
        if (!owner) {
            return message.reply('Le propriétaire de ce serveur est introuvable.');
        }

        // Crée les boutons
        const acceptButton = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Accepter')
            .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
            .setCustomId('reject')
            .setLabel('Refuser')
            .setStyle(ButtonStyle.Danger);

        // Crée une ligne d'action pour les boutons
        const actionRow = new ActionRowBuilder()
            .addComponents(acceptButton, rejectButton);

        // Crée l'embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Couleur de l'embed
            .setTitle('Demande de Rejoindre le Serveur')
            .setDescription(`**Développeur :** ${message.author.tag}\n**Raison :** ${raison}`)
            .setTimestamp();

        // Envoie le message au propriétaire
        try {
            await owner.send({
                embeds: [embed],
                components: [actionRow]
            });
            // Répond à l'utilisateur
            await message.reply('Votre demande a été envoyée au propriétaire du serveur.');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message au propriétaire :', error);
            await message.reply('Une erreur est survenue lors de l\'envoi de votre demande.');
        }
    }
};
