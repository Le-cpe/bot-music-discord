const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Mettre la musique en pause")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    async run(interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            return await interaction.reply("Le bot ne joue pas de musique.");
        }

        const voiceChannelMember = interaction.member.voice.channel;
        const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
        if (!voiceChannelMember) {
            return await interaction.followUp("Vous n'êtes pas dans un salon vocal.");
        }
        if (voiceChannelBot && voiceChannelBot.id !== voiceChannelMember.id) {
            return await interaction.followUp("Vous n'êtes pas dans le même salon vocal.");
        }

        // Pause la musique
        queue.node.pause();

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Musique mise en pause')
            .setDescription("La musique a été mise en pause.")
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
