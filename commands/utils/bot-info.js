const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Affiche les informations sur le bot'),
        run: async (interaction) => {
        const startTime = Date.now() - (process.uptime() * 1000);
        const client = interaction.client;
        const hostname = require('os').hostname();
        const usedMemoryInMB = process.memoryUsage().heapUsed / 1024 / 1024;
        const cpuName = require('os').cpus()[0].model;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: 'Informations sur le bot',
                url: "https://discord.gg/G8jBYUyArW",
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setColor('White')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: '・Identité :',
                    value: `> **Nom :** ${client.user} \\(${client.user.tag}\\)\n` +
                           `> **ID :** ${client.user.id}\n` +
                           `> **Date de création :** <t:${Math.round(client.user.createdTimestamp / 1000)}:R>\n`
                },
                {
                    name: '<:dev:1099328196438138890>・Développeur :',
                    value: `> **Nom : <@1099328196438138890>**\n` +
                           `> **ID :** 1099328196438138890\n`
                },
                {
                    name: '・Statistiques du bot :',
                    value: `> **Démarré :** <t:${Math.round(startTime / 1000)}:f> (<t:${Math.round(startTime / 1000)}:R>)\n` +
                           `> **Serveurs :** ${client.guilds.cache.size || 0} (1 shard)\n` +
                           `> **Utilisateurs :** ${client.users.cache.size || 0}\n` +
                           `> **Salons :** ${client.channels.cache.size || 0}\n` +
                           `> **Rôles :** ${client.guilds.cache.reduce((acc, guild) => acc + (guild.roles.cache.size || 0), 0)}\n` +
                           `> **Boosts :** ${client.guilds.cache.reduce((acc, guild) => acc + (guild.premiumSubscriptionCount || 0), 0)}\n` +
                           `> **Ping avec l'API Discord :** ${client.ws.ping || 0} ms\n`
                },
                {
                    name: '️・Informations techniques :',
                    value: `> **Hébergeur :** ${hostname}\n` +
                           `> **Système d'exploitation :** ${process.platform}\n` +
                           `> **Processeur :** ${cpuName}\n` +
                           `> **Mémoire utilisée :** ${usedMemoryInMB.toFixed(2)} Mo\n` +
                           `> **Node.js :** ${process.version}\n` +
                           `> **discord.js :** v${require('discord.js').version}\n`
                }
            )
            .setTimestamp()
            .setFooter({
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                url: "https://discord.gg/PeBnQkKsyX",
                text: `Notre partenaire Daily question bot`
            });

        await interaction.reply({ embeds: [embed] });
    },
};
