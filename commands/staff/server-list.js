const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const developerId = process.env.DEVELOPER_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-list')
    .setDescription('Affiche la liste de tous les serveurs où le bot est présent.'),

  run: async (interaction) => {
    if (interaction.user.id !== developerId) {
      return await interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    try {
      const guilds = interaction.client.guilds.cache.map(guild => ({
        name: guild.name,
        id: guild.id,
        memberCount: guild.memberCount
      }));

      const perPage = 5;
      let currentPage = 0;
      const totalPages = Math.ceil(guilds.length / perPage);

      const createEmbed = (page) => {
        const embed = new EmbedBuilder()
          .setColor('#5865F2') // Discord Blurple
          .setTitle('🌐 Liste des serveurs')
          .setThumbnail(interaction.client.user.displayAvatarURL()) 
          .setTimestamp()
          .setFooter({ 
            text: `Page ${page + 1}/${totalPages} | ${interaction.client.user.username}`, 
            iconURL: interaction.client.user.displayAvatarURL() 
          });

        const start = page * perPage;
        const end = start + perPage;
        const servers = guilds.slice(start, end);

        servers.forEach((guild, index) => {
          embed.addFields({
            name: `${index + start + 1}. ${guild.name}`, // Numéro + Nom du serveur
            value: `> ID: \`${guild.id}\`\n> Membres: **${guild.memberCount}**`, // Informations alignées
            inline: false // Un serveur par ligne 
          });
        });

        if (servers.length === 0) {
          embed.setDescription("Aucun serveur trouvé sur cette page."); 
        }

        return embed;
      };

      const createButtons = (page) => {
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('previous')
              .setLabel('⬅️ Précédent')
              .setStyle(ButtonStyle.Secondary) // Gris clair
              .setDisabled(page === 0),
            new ButtonBuilder()
              .setCustomId('next')
              .setLabel('Suivant ➡️')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(page === totalPages - 1)
          );
        return row;
      };

      const initialEmbed = createEmbed(currentPage);
      const initialButtons = createButtons(currentPage);

      const message = await interaction.reply({ embeds: [initialEmbed], components: [initialButtons], fetchReply: true });

      const collector = message.createMessageComponentCollector({ time: 60000 });

      collector.on('collect', async (buttonInteraction) => {
        if (buttonInteraction.customId === 'previous') {
          currentPage--;
        } else if (buttonInteraction.customId === 'next') {
          currentPage++;
        }

        const newEmbed = createEmbed(currentPage);
        const newButtons = createButtons(currentPage);

        await buttonInteraction.update({ embeds: [newEmbed], components: [newButtons] });
      });

      collector.on('end', () => {
        // Désactiver les boutons à la fin (facultatif)
        message.edit({ components: [] });
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Une erreur est survenue lors de la récupération des serveurs.', ephemeral: true });
    }
  },
};