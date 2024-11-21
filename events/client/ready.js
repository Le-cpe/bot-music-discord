const { Events, ActivityType } = require("discord.js");
const packageJson = require("../../package.json"); // Pour obtenir la version depuis package.json

module.exports = {
  name: Events.ClientReady,
  async run(client) {
    // Charger les commandes
    await client.application.commands.set(client.commands.map(commands => commands.data));
    console.log("[Interactions] => loaded");

    // Définir la version du bot depuis package.json
    const botVersion = packageJson.version;

    // Tableau des messages de présence
    const presenceMessages = [
      `Version ${botVersion}`, // Affiche la version du bot
      `${client.guilds.cache.size} serveurs`, // Nombre de serveurs
      `${client.users.cache.size} utilisateurs` // Nombre d'utilisateurs
    ];

    let currentIndex = 0; // Index pour suivre quel message afficher

    // Fonction pour mettre à jour la présence
    const updatePresence = async () => {
      try {
        await client.user.setPresence({
          activities: [
            {
              name: presenceMessages[currentIndex], // Message de présence
              type: ActivityType.Streaming, // Utilise ActivityType.Streaming pour le statut "STREAMING"
              url: 'https://twitch.tv/winterskyone' // Remplace par l'URL de ton choix, comme une chaîne Twitch
            }
          ],
          status: 'online' // Statut: en ligne
        })

        // Passer à l'index suivant
        currentIndex = (currentIndex + 1) % presenceMessages.length; // Boucle à travers les messages
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la présence:', error);
      }
    };

    // Mettre à jour la présence immédiatement
    await updatePresence();

    // Mettre à jour la présence toutes les 20 secondes
    setInterval(updatePresence, 10000); // 20000 ms = 20 secondes

    console.log(`[Bot] => ${client.user.username} est en ligne avec la version ${botVersion}`);
  },
};
