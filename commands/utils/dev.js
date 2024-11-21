const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Affiche des informations sur le développeur du bot.'),
    
    async run(interaction) {
        const devEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Développeur du Bot')
            .setDescription('Voici les informations sur le développeur du bot :')
            .addFields(
                { name: 'Nom', value: 'lilian.radio', inline: true },  // Remplace par ton nom
                { name: 'ID', value: '<@1099328196438138890>', inline: true },  // Remplace par ton ID
                { name: 'Support', value: '[Discord](https://discord.gg/jSvYxahuYH)', inline: true } // Remplace par ton site ou GitHub
            )
            .setTimestamp()
            .setFooter({ text: 'Bot développé avec ❤️' }); // Ajouter un footer si désiré

        await interaction.reply({ embeds: [devEmbed] });
    },
};
