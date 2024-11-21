const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Affiche la file d'attente de musique actuelle")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    async run(interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            return await interaction.reply({ content: "Le bot ne joue pas de musique.", ephemeral: true });
        }

        const voiceChannelMember = interaction.member.voice.channel;
        const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
        if (!voiceChannelMember) {
            return await interaction.followUp({ content: "Vous n'êtes pas dans un salon vocal.", ephemeral: true });
        }
        if (voiceChannelBot && voiceChannelBot.id !== voiceChannelMember.id) {
            return await interaction.followUp({ content: "Vous n'êtes pas dans le même salon vocal.", ephemeral: true });
        }

        // Récupère la liste des pistes dans la file d'attente
        const tracks = queue.tracks.toArray();
        if (tracks.length === 0) {
            return await interaction.reply({ content: "La file d'attente est vide.", ephemeral: true });
        }

        // Crée un embed pour afficher la file d'attente
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('File d\'attente')
            .setDescription(tracks.map((track, index) => `${index + 1}. **${track.title}** - ${track.author}`).join('\n'))
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
