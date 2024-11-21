const { SlashCommandBuilder } = require('discord.js');

// Tableau pour stocker les messages envoyés par le bot à chaque utilisateur
const userMessages = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear-mp')
        .setDescription('Supprime tous les messages privés envoyés par le bot.'),
    async run(interaction) {
        const userId = interaction.user.id;

        // Vérifier si l'utilisateur a des messages enregistrés
        if (!userMessages.has(userId) || userMessages.get(userId).length === 0) {
            return interaction.reply({ content: 'Aucun message privé à supprimer.', ephemeral: true });
        }

        // Supprimer tous les messages enregistrés pour cet utilisateur
        userMessages.delete(userId);

        await interaction.reply({ content: 'Tous vos messages privés envoyés par le bot ont été supprimés.', ephemeral: true });
    },
};

// Fonction pour envoyer un message et l'enregistrer
async function sendMessage(user, content) {
    try {
        await user.send(content);
        
        // Enregistrer le message dans le tableau pour cet utilisateur
        if (!userMessages.has(user.id)) {
            userMessages.set(user.id, []);
        }
        userMessages.get(user.id).push(content);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
    }
}
