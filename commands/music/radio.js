const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Stream une radio dans votre canal vocal.')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('station')
                .setDescription('Sélectionnez une station de radio à écouter')
                .setRequired(true)
                .addChoices(
                    { name: 'Freedom', value: 'https://freedomice.streamakaci.com/freedom.mp3' },
                    { name: 'NRJ', value: 'https://scdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios' },
                    { name: 'FunRadio', value: 'http://icecast.funradio.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg' },
                    { name: 'RTL', value: 'http://icecast.rtl.fr/rtl-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg' },
                    { name: 'RTL2', value: 'http://icecast.rtl2.fr/rtl2-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg' },
                    { name: 'Rire & Chansons', value: 'https://scdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios' },
                    { name: 'Chérie FM', value: 'https://scdn.nrjaudio.fm/adwz2/fr/30201/mp3_128.mp3?origine=fluxradios' },
                )),
    
    async run(interaction, client) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({
                content: 'Vous devez être dans un canal vocal pour utiliser cette commande!',
                ephemeral: true
            });
        }

        const radioURL = interaction.options.getString('station'); // Récupérer l'URL de la station sélectionnée

        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            const resource = createAudioResource(radioURL);

            player.play(resource);
            connection.subscribe(player);

            // Stocker la connexion et le joueur
            client.voiceConnections.set(interaction.guild.id, { connection, player });

            // Création d'un embed pour le message de confirmation
            const embed = new EmbedBuilder()
                .setColor(0x1DB954) // Couleur verte
                .setTitle('🎶 Station de Radio')
                .setDescription(`La radio a commencé à jouer dans **${channel.name}**`)
                .setTimestamp()
                .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            const embed = new EmbedBuilder()
            .setColor(0x1DB954) // Couleur verte
            .setTitle('🎶 Station de Radio')
            .setDescription(`La radio a commencé à jouer dans **${channel.name}**`)
            .setTimestamp()
            .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
