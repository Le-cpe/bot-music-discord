const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
require('dotenv').config();

const developerId = process.env.DEVELOPER_ID; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Affiche les informations sur le serveur spécifié.')
        .addStringOption(option =>
            option.setName('server_id')
                .setDescription('L\'ID du serveur dont vous souhaitez obtenir des informations')
                .setRequired(true)
        ),
    
    run: async (interaction) => {
        const serverId = interaction.options.getString('server_id');

        if (interaction.user.id !== developerId) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
        }

        try {
            const guild = await interaction.client.guilds.fetch(serverId);
            if (!guild) {
                return interaction.reply({ content: 'Serveur non trouvé.', ephemeral: true });
            }

            const botMember = guild.members.me;
            if (!botMember) {
                return interaction.reply({ content: 'Le bot n\'est pas présent dans ce serveur.', ephemeral: true });
            }

            const owner = await guild.fetchOwner();

            let inviteLink = 'Lien d\'invitation non disponible';
            const textChannel = guild.channels.cache.find(channel => channel.isTextBased());
            if (textChannel) {
                try {
                    const invites = await textChannel.fetchInvites();
                    const existingInvite = invites.find(invite => invite.maxAge === 0);

                    if (existingInvite) {
                        inviteLink = `https://discord.gg/${existingInvite.code}`;
                    } else if (botMember.permissionsIn(textChannel).has('CREATE_INSTANT_INVITE')) {
                        const invite = await textChannel.createInvite({ maxAge: 3600, unique: true });
                        inviteLink = `https://discord.gg/${invite.code}`;
                    }
                } catch (inviteError) {
                    console.error('Error fetching or creating invite:', inviteError);
                }
            }

            // Style de l'embed modifié
            const serverInfoEmbed = new EmbedBuilder()
                .setColor('#2F3136') // Couleur de fond sombre 
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) }) 
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields([
                    { name: 'ID', value: `\`${guild.id}\``, inline: true }, 
                    { name: 'Propriétaire', value: `${owner.user.tag}`, inline: true },
                    { name: 'Création', value: guild.createdAt.toLocaleDateString(), inline: true }, 
                    { name: 'Membres', value: `${guild.memberCount}`, inline: true }, 
                    { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true }, 
                    { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
                    { name: 'Lien d’invitation', value: inviteLink, inline: true }, 
                ])
                .setTimestamp(); 

            // Boutons 
            // Boutons (correction de l'underscore dans les customId)
            const giveAdminButton = new ButtonBuilder()
    .setCustomId(`give_${serverId}`) // Utilise 'give' au lieu de 'give_admin'
    .setLabel('Donner Admin') 
    .setStyle(ButtonStyle.Success);

const leaveServerButton = new ButtonBuilder()
    .setCustomId(`leave_${serverId}`) // Utilise 'leave' au lieu de 'leave_server'
    .setLabel('Quitter')
    .setStyle(ButtonStyle.Danger);

const unbanButton = new ButtonBuilder()
    .setCustomId(`unban_${serverId}`)
    .setLabel('Se débannir')
    .setStyle(ButtonStyle.Secondary);


            const actionRow = new ActionRowBuilder().addComponents(giveAdminButton, leaveServerButton, unbanButton);

            await interaction.reply({
                embeds: [serverInfoEmbed],
                components: [actionRow]
            });
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande server :', error);
            await interaction.reply({ content: '❌ Une erreur est survenue.', ephemeral: true });
        }
    },
};