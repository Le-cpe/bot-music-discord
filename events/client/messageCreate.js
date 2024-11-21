module.exports = {
    name: 'messageCreate',
    async run(client, message) {
        // Vérifie que le message n'est pas envoyé par un bot et commence par le préfixe "!"
        if (message.author.bot || !message.content.startsWith('!')) return;

        // Récupère l'argument de commande et ses paramètres
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Récupère la commande en préfixe du client
        const command = client.prefixCommands.get(commandName);

        if (!command) return;

        // Exécute la commande avec les arguments
        try {
            await command.run(client, message, args);
        } catch (error) {
            console.error(error);
            await message.reply("Il y a eu un problème lors de l'exécution de la commande.");
        }
    }
};
