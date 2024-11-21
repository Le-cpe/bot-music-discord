const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche toutes les commandes disponibles, regroupées par catégorie.'),

  async run(interaction) {
    const commandsPath = path.join(__dirname, '../..', 'commands');
    const categories = {};

    // Fonction pour charger les commandes depuis les fichiers
    const loadCommands = (dir) => {
      fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
          loadCommands(fullPath); // Récursion pour les sous-dossiers
        } else if (file.endsWith('.js')) {
          try {
            const command = require(fullPath);

            // Ignorer les fichiers qui ne sont pas des commandes valides
            if (!command.data || !command.data.name) return;

            const category = path.relative(commandsPath, path.dirname(fullPath)) || 'Général';

            // Ajouter la commande à la catégorie correspondante
            categories[category] = categories[category] || [];
            categories[category].push(command.data.name);
          } catch (error) {
            console.error(`Erreur lors du chargement de la commande ${fullPath}:`, error);
          }
        }
      });
    };

    // Charger toutes les commandes
    loadCommands(commandsPath);

    // Créer l'embed de la commande help
    const embed = new EmbedBuilder()
      .setColor('#0099ff') // Couleur bleue
      .setTitle('📚 Liste des commandes')
      .setDescription('Voici la liste de toutes les commandes disponibles, regroupées par catégorie.')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setTimestamp();

    // Parcourir les catégories et les commandes
    for (const [category, commands] of Object.entries(categories)) {
      embed.addFields({
        name: `**${category}**`,
        value: `\`\`\`${commands.join('\n')}\`\`\``, // Utiliser des blocs de code pour un meilleur formatage
        inline: false, 
      });
    }

    // Envoyer l'embed à l'utilisateur
    await interaction.reply({ embeds: [embed] });
  },
};