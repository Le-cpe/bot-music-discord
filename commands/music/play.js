// play.js
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Jouer de la musique")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(opt =>
            opt.setName("song")
                .setDescription("La chanson à jouer")
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
                .setDescription("Vous n'êtes pas dans un canal vocal.");
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
        }

        if (voiceChannelBot && voiceChannelBot.id !== voiceChannelMember.id) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Vous n'êtes pas sur le même canal vocal.");
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
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
                    selfDeaf: true // Correction : selfDeaf au lieu de selDeaf
                }
            });

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`🎵 **La musique** \`${track.title}\` **a été ajoutée à la file d'attente.**\n\n🧑‍🤝‍🧑 **Auteur:** \`${track.author}\`\n\n⏰ **Durée:** \`${track.duration}\`\n\n📹 **Url de la vidéo:** [Clique ici](${track.url})`);


            const pauseButton = new ButtonBuilder()
                .setCustomId('pause_music')
                .setLabel('Pause')
                .setStyle(ButtonStyle.Primary);

            const resumeButton = new ButtonBuilder()
                .setCustomId('resume_music')
                .setLabel('Reprendre')
                .setStyle(ButtonStyle.Success);

            const stopButton = new ButtonBuilder()
                .setCustomId('stop_music')
                .setLabel('Stop')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
                .addComponents(pauseButton, resumeButton, stopButton);

            await interaction.followUp({ embeds: [embed], components: [row] });

        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`La musique \`${song}\` n'a pas été trouvée.`);
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
};