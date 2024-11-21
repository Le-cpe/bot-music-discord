const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const path = require('path'); // Pour gérer le chemin du fichier

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ph')
        .setDescription('Joue un fichier audio local nommé mdr.mp3.')
        .setDMPermission(false),
    
    async run(interaction, client) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({
                content: 'Vous devez être dans un canal vocal pour utiliser cette commande !',
                ephemeral: true
            });
        }

        const filePath = path.join(__dirname, 'mdr.mp3'); // Chemin vers le fichier audio

        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            const resource = createAudioResource(filePath);

            player.play(resource);
            connection.subscribe(player);

            // Stocker la connexion et le joueur
            client.voiceConnections.set(interaction.guild.id, { connection, player });

            // Création d'un embed pour le message de confirmation
            const embed = new EmbedBuilder()
                .setColor(0x1DB954) // Couleur verte
                .setTitle('🎶 Lecture Locale')
                .setDescription(`Le fichier **mdr.mp3** a commencé à jouer dans **${channel.name}**`)
                .setTimestamp()
                .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            // Création d'un embed pour le message de confirmation
            const embed = new EmbedBuilder()
                .setColor(0x1DB954) // Couleur verte
                .setTitle('🎶 Lecture Locale')
                .setDescription(`Le fichier **mdr.mp3** a commencé à jouer dans **${channel.name}**`)
                .setTimestamp()
                .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });s
        }
    },
};
