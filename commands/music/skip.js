const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Passer à la musique suivante")
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

        // Vérifier s'il y a une autre musique dans la file d'attente
        if (queue.tracks.length === 0) {
            return await interaction.reply("Il n'y a pas de musique à passer.");
        }

        // Passer à la musique suivante
        const skippedTrack = queue.node.skip();

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Musique passée')
            .setDescription(`La musique **${skippedTrack.title}** a été passée.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
