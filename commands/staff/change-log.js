const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CHANNEL_ID = '1289937864360202264'; 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('change-log')
    .setDescription('Envoie un journal des changements')
    .addStringOption(option =>
      option.setName('nouvelle_commande')
        .setDescription('Nouvelle commande ajoutée')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nouveau_debogage')
        .setDescription('Débogage effectué')
        .setRequired(true)
    ),

  run: async (interaction) => {
    // Vérifie si l'utilisateur est le développeur
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
      return interaction.reply({ content: 'Seul le développeur peut utiliser cette commande.', ephemeral: true });
    }

    // Lire le fichier package.json pour obtenir la version
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    let version = 'Indisponible'; 

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      version = packageJson.version;
    } catch (error) {
      console.error('Erreur lors de la lecture de package.json:', error);
    }

    // Récupérer les options de l'interaction
    const nouvelleCommande = interaction.options.getString('nouvelle_commande');
    const nouveauDebogage = interaction.options.getString('nouveau_debogage');

    // Créer l'embed
    const embed = new EmbedBuilder()
      .setColor('#7289DA')  // Couleur "Blurple" de Discord
      .setAuthor({ 
        name: `Change Log - Version ${version}`, 
        iconURL: interaction.client.user.displayAvatarURL() // Icône du bot
      }) 
      .setDescription('Voici les dernières mises à jour du bot :')
      .addFields(
        { 
          name: '🚀 Nouvelle commande', 
          value: `\`\`\`${nouvelleCommande}\`\`\``, // Bloc de code pour la commande 
          inline: true 
        },
        { 
          name: '🐛 Débogage', 
          value: nouveauDebogage, 
          inline: true 
        },
      )
      .setTimestamp();

    // Récupérer le canal
    const channel = interaction.client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
      return interaction.reply({ content: 'Erreur : le canal spécifié est introuvable.', ephemeral: true });
    }

    // Envoyer l'embed dans le canal
    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Le journal des changements a été envoyé avec succès !', ephemeral: true });
  },
};
