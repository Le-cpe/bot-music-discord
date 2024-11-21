// musicInteractionCreate.js
const { Events } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {
        if (!interaction.isButton()) return;

        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: "Il n'y a pas de musique en cours de lecture !", ephemeral: true });
        }

        if (interaction.customId === 'pause_music') {
            queue.node.pause();
            await interaction.reply({ content: "Musique mise en pause !", ephemeral: true });
        } else if (interaction.customId === 'resume_music') {
            queue.node.resume();
            await interaction.reply({ content: "Musique reprise !", ephemeral: true });
        } else if (interaction.customId === 'stop_music') {
            queue.node.stop();
            await interaction.reply({ content: "Musique arrêtée !", ephemeral: true });
        }
    },
};