// commands/send-owner.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config(); // Charger les variables d'environnement depuis .env

const developerId = process.env.DEVELOPER_ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-owner')
        .setDescription('Envoie un message à tous les propriétaires de serveurs où le bot est présent.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le message à envoyer')
                .setRequired(true)),
    
    run: async (interaction) => {
        if (interaction.user.id !== developerId) {
            return interaction.reply({ content: '❌ Vous n\'êtes pas autorisé à utiliser cette commande.', ephemeral: true });
        }

        const messageContent = interaction.options.getString('message');
        const guilds = interaction.client.guilds.cache;
        const owners = guilds.map(guild => guild.ownerId);
        const uniqueOwners = Array.from(new Set(owners)); // Enlève les doublons
        const botAvatarURL = interaction.client.user.displayAvatarURL();

        // Répondre que le bot commence à envoyer les messages
        await interaction.reply('Envoi du message aux propriétaires. Cela peut prendre un moment.');

        // Fonction pour envoyer les messages
        async function sendMessages() {
            for (const ownerId of uniqueOwners) {
                try {
                    const user = await interaction.client.users.fetch(ownerId);
                    if (user) {
                        const embed = new EmbedBuilder()
                            .setColor('#FF69B4') // Choisissez une couleur vive
                            .setTitle('📬 Message pour tous les owners de serveur')
                            .setDescription(messageContent)
                            .setThumbnail(botAvatarURL) // Utiliser l'avatar du bot
                            .addFields(
                                { name: '🎉 Fun', value: 'Nous espérons que vous vous amusez bien avec notre bot!' },
                                { name: '💬 Contact', value: 'Pour toute question, n\'hésitez pas à nous contacter.' }
                            )
                            .setFooter({ text: 'Envoyé par le Staff du Bot', iconURL: botAvatarURL }) // Utiliser l'avatar du bot
                            .setTimestamp();

                        await user.send({ embeds: [embed] });
                        console.log(`Message envoyé à ${user.tag}`);
                    }
                } catch (error) {
                    console.error(`Impossible d'envoyer un message à l'utilisateur ${ownerId}:`, error);
                }
                // Attendre 10 secondes avant d'envoyer le message suivant
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }

        // Démarrer l'envoi des messages
        sendMessages().then(() => {
            console.log('Tous les messages ont été envoyés.');
        }).catch(error => {
            console.error('Erreur lors de l\'envoi des messages:', error);
        });
    },
};
