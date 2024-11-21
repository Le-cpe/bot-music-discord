const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('appel')
        .setDescription('Appel un membre du staff pour assistance.')
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('La raison de l\'appel')
                .setRequired(true) // Rendre la raison obligatoire
        ),
    async run(interaction) {
        const memberId = interaction.user.id; // ID de l'utilisateur qui appelle
        const reason = interaction.options.getString('raison'); // Récupérer la raison de l'appel

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🔔 Alerte de Support')
            .setDescription(`Un appel a été fait par <@${memberId}> pour la raison suivante : ${reason}. Cliquez sur le bouton ci-dessous pour prendre en charge.`)
            .setTimestamp();

        const takeCallButton = new ButtonBuilder()
            .setCustomId(`take_support_call`)
            .setLabel('Prendre en charge')
            .setStyle(ButtonStyle.Primary);

        const resolvedButton = new ButtonBuilder()
            .setCustomId(`resolve_alert`)
            .setLabel('Alerte Résolue')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true); // D'abord désactivé

        const row = new ActionRowBuilder().addComponents(takeCallButton, resolvedButton);

        // Envoyer l'alerte dans le salon de support
        const supportChannelId = '1289937886539415605'; // ID du salon de support
        const channel = interaction.client.channels.cache.get(supportChannelId);

        if (!channel) {
            return interaction.reply({ content: 'Salon de support introuvable.', ephemeral: true });
        }

        // Créer une invitation pour le serveur
        let invite;
        const channels = interaction.guild.channels.cache.filter(channel => 
            channel.isTextBased() && 
            channel.permissionsFor(interaction.guild.members.me).has('CREATE_INSTANT_INVITE')
        );
        
        const firstTextChannel = channels.first();
        
        if (firstTextChannel) {
            invite = await firstTextChannel.createInvite({ maxAge: 86400, maxUses: 0, unique: true });
        } else {
            return interaction.reply({ content: 'Impossible de créer une invitation, aucun salon textuel approprié trouvé.', ephemeral: true });
        }

        // Ajouter l'invitation à l'embed
        embed.addFields({ name: 'Lien d\'invitation', value: invite.url });

        // Envoyer l'alerte au salon de support
        await channel.send({ embeds: [embed], components: [row] });

        // Informer le membre que l'appel a été fait dans un embed
        const dmEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔄 Confirmation d\'Appel')
            .setDescription('Votre appel a été reçu et un membre du staff va le prendre en charge.')
            .setTimestamp();

        try {
            await interaction.user.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du DM au membre:', error);
        }

        await interaction.reply({ content: 'Votre appel a été envoyé au staff.', ephemeral: true });
    },
};

// Événement pour gérer l'interaction des boutons
module.exports = {
    name: 'interactionCreate',
    async run(client, interaction) {
        if (!interaction.isButton()) return;

        const [action] = interaction.customId.split('_');

        switch (action) {
            case 'take_support_call':
                await handleTakeSupportCall(interaction);
                break;
            case 'resolve_alert':
                await handleResolveAlert(interaction);
                break;
            default:
                // Action inconnue
                break;
        }
    },
};

// Gestion de la prise en charge de l'appel
async function handleTakeSupportCall(interaction) {
    const memberWhoCalled = interaction.message.embeds[0].description.match(/<@(\d+)>/)[1]; // Extraire l'ID du membre qui a appelé
    const member = await interaction.guild.members.fetch(memberWhoCalled);

    if (!member) {
        return interaction.reply({ content: 'Le membre qui a appelé n\'a pas été trouvé.', ephemeral: true });
    }

    // Envoyer un message au membre qui a appelé
    try {
        const memberEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🆘 Demande d\'Aide Prise en Charge')
            .setDescription(`Votre demande a été prise en charge par <@${interaction.user.id}>.`)
            .setTimestamp();

        await member.send({ embeds: [memberEmbed] });
        
        // Mise à jour des composants pour activer le bouton "Alerte Résolue"
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`take_support_call`)
                    .setLabel('Prendre en charge')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true), // Désactiver le bouton "Prendre en charge"
                new ButtonBuilder()
                    .setCustomId(`resolve_alert`)
                    .setLabel('Alerte Résolue')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(false) // Activer le bouton "Alerte Résolue"
            );

        await interaction.update({ components: [row] });

        await interaction.reply({ content: 'Vous avez pris en charge la demande. Un message a été envoyé au membre.', ephemeral: true });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message au membre:', error);
        await interaction.reply({ content: 'Impossible d\'envoyer un message au membre.', ephemeral: true });
    }
}

// Gestion de la résolution de l'alerte
async function handleResolveAlert(interaction) {
    const memberWhoCalled = interaction.message.embeds[0].description.match(/<@(\d+)>/)[1]; // Extraire l'ID du membre qui a appelé
    const member = await interaction.guild.members.fetch(memberWhoCalled);

    if (!member) {
        return interaction.reply({ content: 'Le membre qui a appelé n\'a pas été trouvé.', ephemeral: true });
    }

    // Envoyer un message au membre pour l'informer de la résolution
    try {
        const memberEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Alerte Résolue')
            .setDescription('Votre demande a été résolue par un membre du staff.')
            .setTimestamp();

        await member.send({ embeds: [memberEmbed] });

        // Modifier l'embed dans le salon de support
        const supportEmbed = interaction.message.embeds[0];
        supportEmbed.setColor('#00FF00'); // Changer la couleur en vert
        supportEmbed.setDescription(`${supportEmbed.description}\n\n**Statut : Résolu**`);

        // Désactiver les boutons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`take_support_call`)
                    .setLabel('Prendre en charge')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`resolve_alert`)
                    .setLabel('Alerte Résolue')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            );

        await interaction.update({ embeds: [supportEmbed], components: [row] });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message au membre:', error);
        await interaction.reply({ content: 'Impossible d\'envoyer un message au membre.', ephemeral: true });
    }
}
