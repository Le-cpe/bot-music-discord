const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Afficher l'invitation du bot."),

    async run(client, interaction) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Ajoutez ${client.user.username} à votre serveur !`, url: "https://discord.gg/G8jBYUyArW", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setColor('White');

        const bouton1 = new ButtonBuilder()
            .setStyle('Link')
            .setLabel(`Inviter ${client.user.username}`)
            .setEmoji('🧨')
            .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=-1`);

        const bouton2 = new ButtonBuilder()
            .setStyle('Link')
            .setLabel(`Serveur support`)
            .setEmoji('<:dev:1145032258508570634>')
            .setURL('https://discord.gg/G8jBYUyArW');

        const bouton3 = new ButtonBuilder()
            .setStyle('Link')
            .setLabel(`Site internet`)
            .setEmoji('🔗')
            .setURL('https://discord.gg/G8jBYUyArW');

        const row = new ActionRowBuilder().addComponents(bouton1, bouton2, bouton3);

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
