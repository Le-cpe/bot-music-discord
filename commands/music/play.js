const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a music")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(opt =>
            opt.setName("song")
               .setDescription("The song to play")
               .setRequired(true)
               .setAutocomplete(true)),
               

    async run(interaction) {
        await interaction.deferReply();
        const song = interaction.options.getString("song");

        const voiceChannelMember = interaction.member.voice.channel;
        const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;

        if (!voiceChannelMember) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("You are not in a voice channel.");
            return await interaction.followUp({ embeds: [embed] });
        }

        if (voiceChannelBot && voiceChannelBot.id !== voiceChannelMember.id) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("You are not in the same voice channel.");
            return await interaction.followUp({ embeds: [embed] });
        }

        try {
            const { track } = await interaction.client.player.play(voiceChannelMember, song, {
                requestedBy: interaction.user,
                nodeOptions: {
                    metadata: interaction,
                    volume: 50,
                    leaveOnStop: true,
                    leaveOnEmpty: true,
                    leaveOnEnd: false,
                    selDeaf: true
                }
            });

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`🎵 **La musique** \`${track.title}\` **a été ajoutée à la file d'attente.**\n\n🧑‍🤝‍🧑 **Auteur:** \`${track.author}\`\n\n⏰ **Durée:** \`${track.duration}\`\n\n📹 **Url de la vidéo:** [Clique ici](${track.url})`);

            await interaction.followUp({ embeds: [embed] });
        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The music \`${song}\` was not found.`);
            return await interaction.followUp({ embeds: [embed] });
        }
    }
};
