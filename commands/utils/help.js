const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche toutes les commandes disponibles regroupées par dossier.'),

  async run(interaction) {
    // Chemin vers le dossier des commandes
    const commandsPath = path.join(__dirname, '../..', 'commands');
    const categories = {};

    // Fonction pour charger les commandes depuis les sous-dossiers
    const loadCommands = (dir) => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
          // Recurse dans les sous-dossiers
          loadCommands(fullPath);
        } else if (file.endsWith('.js')) {
          const command = require(fullPath);
          const category = path.relative(commandsPath, path.dirname(fullPath));
          
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(command.data.name);
        }
      }
    };

    // Charger toutes les commandes
    loadCommands(commandsPath);

    // Créer un embed pour afficher les commandes
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Liste des Commandes')
      .setDescription('Voici la liste complète des commandes disponibles.');

    // Ajouter les commandes à l'embed
    for (const [category, commands] of Object.entries(categories)) {
      embed.addFields({
        name: category || 'Général',
        value: commands.length > 0 ? commands.join(', ') : 'Aucune commande',
        inline: false,
      });
    }

    // Envoyer la réponse avec l'embed
    await interaction.reply({ embeds: [embed] });
  },
};
