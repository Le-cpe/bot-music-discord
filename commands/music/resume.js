const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Reprendre la musique")
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

        // Reprendre la musique
        queue.node.resume();

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Musique reprise')
            .setDescription("La musique a été reprise.")
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
