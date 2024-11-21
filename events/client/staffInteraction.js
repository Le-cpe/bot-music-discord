const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {
        if (!interaction.isButton()) return; // Vérifie que c'est bien un bouton

        console.log(`Interaction reçue : ${interaction.customId}`); // Log de l'interaction

        const [action] = interaction.customId.split('_');

        switch (action) {
            case 'take':
                console.log('Action : Prendre en charge l\'appel de support.');
                await handleTakeSupportCall(interaction);
                break;
            case 'resolve':
                console.log('Action : Marquer l\'alerte comme résolue.');
                await handleResolveAlert(interaction);
                break;
            default:
                console.log('Action inconnue reçue :', action); // Log de l'action inconnue
                break;
        }
    },
};

// Gestion de la prise en charge de l'appel
async function handleTakeSupportCall(interaction) {
    const memberWhoCalled = interaction.message.embeds[0].description.match(/<@(\d+)>/)[1]; // Extraire l'ID du membre qui a appelé
    console.log(`Membre qui a appelé : ${memberWhoCalled}`); // Log de l'ID du membre qui a appelé

    const member = await interaction.guild.members.fetch(memberWhoCalled);

    if (!member) {
        console.log('Membre non trouvé.');
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
        console.log(`Message envoyé au membre <@${memberWhoCalled}> avec succès.`); // Log du succès d'envoi de message
        await interaction.reply({ content: 'Vous avez pris en charge la demande. Un message a été envoyé au membre.', ephemeral: true });

        // Activer le bouton "Alerte Résolue"
        const resolvedButton = new ButtonBuilder()
            .setCustomId(`resolve_alert`)
            .setLabel('Alerte Résolue')
            .setStyle(ButtonStyle.Success)
            .setDisabled(false); // Activer le bouton

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`take_support_call`)
                .setLabel('Prendre en charge')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true), // Désactiver le bouton "Prendre en charge"
            resolvedButton
        );

        await interaction.update({ components: [row] }); // Mettre à jour les composants
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
        console.log('Membre non trouvé.');
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
        const supportEmbed = new EmbedBuilder(interaction.message.embeds[0].data); // Créer une nouvelle instance avec les données de l'ancien embed
        supportEmbed.setColor('#00FF00'); // Changer la couleur en vert
        supportEmbed.setDescription(`${supportEmbed.data.description}\n\n**Statut : Résolu**`); // Mettez à jour la description

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
