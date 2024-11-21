const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setvolume")
        .setDescription("Définir le volume de la musique")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addNumberOption(opt => 
            opt.setName("volume")
                .setDescription("Le volume requis")
                .setRequired(true)
                .setMaxValue(100)
                .setMinValue(1)
        ),

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

        const volume = interaction.options.getNumber("volume");
        if (queue.node.volume === volume) {
            return await interaction.reply(`Le volume est déjà à \`${queue.node.volume}\`.`);
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Volume mis à jour')
            .setDescription(`Le volume est passé de \`${queue.node.volume}\` à \`${volume}\`.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        queue.node.setVolume(volume);
    }
};
