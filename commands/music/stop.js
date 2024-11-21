const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Déconnecte le bot du canal vocal.")
        .setDMPermission(false),

    async run(interaction) {
        // Vérifie si l'interaction a déjà été traitée
        if (interaction.deferred || interaction.replied) return;

        // Déferre la réponse pour éviter l'erreur InteractionNotReplied
        await interaction.deferReply();

        const voiceChannelMember = interaction.member.voice.channel;

        if (!voiceChannelMember) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Vous devez être dans un canal vocal pour déconnecter le bot.");
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
        }

        const botMember = interaction.guild.members.me;

        // Déconnecter le bot du canal vocal
        if (botMember.voice.channel) {
            await botMember.voice.disconnect();
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Le bot a quitté le canal vocal.");
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Le bot n'est pas dans un canal vocal.");
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
};
