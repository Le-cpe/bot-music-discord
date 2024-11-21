const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Répète la musique en cours ou la file d’attente.')
    .setDMPermission(false)
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Mode de répétition (désactivé par défaut)')
        .setRequired(false)
        .addChoices(
          { name: 'Désactivé', value: 'off' },
          { name: 'Musique', value: 'track' },
          { name: 'File d\'attente', value: 'queue' },
        )
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(null),

  async run(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return await interaction.reply({
        content: "❌ Il n'y a pas de musique en cours de lecture.",
        ephemeral: true,
      });
    }

    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;

    if (!voiceChannelMember) {
      return await interaction.followUp({
        content: "⚠️ Vous devez être dans un salon vocal pour utiliser cette commande.",
        ephemeral: true,
      });
    }

    if (voiceChannelBot && voiceChannelBot.id !== voiceChannelMember.id) {
      return await interaction.followUp({
        content: "⚠️ Vous devez être dans le même salon vocal que le bot pour utiliser cette commande.",
        ephemeral: true,
      });
    }

    const loopMode = interaction.options.getString('mode') || 'off';
    const oldLoopMode = queue.repeatMode; // Obtenir le mode de répétition actuel

    switch (loopMode) {
      case 'off':
        queue.setRepeatMode(0);
        break;
      case 'track':
        queue.setRepeatMode(1);
        break;
      case 'queue':
        queue.setRepeatMode(2);
        break;
    }

    // Description en fonction du changement de mode
    let description = '';
    if (loopMode === 'off') {
      description = '🔁 La répétition est maintenant **désactivée**.';
    } else if (loopMode === 'track' && oldLoopMode !== 1) { // Vérifier si le mode a changé
      description = '🔁 La musique actuelle sera répétée en boucle.';
    } else if (loopMode === 'queue' && oldLoopMode !== 2) { // Vérifier si le mode a changé
      description = '🔁 La file d’attente sera répétée en boucle.';
    } else { // Si le mode est le même
      description = `🔁 Le mode de répétition est déjà sur **${loopMode === 'track' ? 'Musique' : 'File d\'attente'}**.`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setDescription(description)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};