const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot'),
     run: async (interaction) => {
        const sent = await interaction.reply({ content: 'Calcul de la latence...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        await interaction.editReply(`Pong! 🏓 Latence du bot: ${latency}ms. Latence de l'API: ${apiLatency}ms.`);
    },
};
