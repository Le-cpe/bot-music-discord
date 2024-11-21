const { Events } = require('discord.js');

// interactionCreate.js (ou un nom similaire)
module.exports = {
    name: 'interactionCreate',
    async run(client, interaction) {
        // Gérer les interactions ici
        if (!interaction.isButton()) return; // Vérifie si l'interaction est un clic sur un bouton

        // Logique pour gérer les boutons ici
        const { customId } = interaction;
        const supportChannel = client.channels.cache.get('1289937884366897152'); // ID du salon où envoyer les messages

        if (customId === 'accept') {
            await supportChannel.send(`${interaction.user.tag} a accepté la demande.`);
            await interaction.reply({ content: 'Demande acceptée.', ephemeral: true });
        } else if (customId === 'reject') {
            await supportChannel.send(`${interaction.user.tag} a refusé la demande.`);
            await interaction.reply({ content: 'Demande refusée.', ephemeral: true });
        }
    }
};
