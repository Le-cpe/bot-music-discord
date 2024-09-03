const { Events, ActivityType } = require("discord.js");
const packageJson = require("../../package.json"); // Pour obtenir la version depuis package.json

module.exports = {
  name: Events.ClientReady,
  async run(client) {
    // Charger les commandes
    await client.application.commands.set(client.commands.map(commands => commands.data));
    console.log("[Interactions] => loaded");

    // Définir la version du bot (changer selon votre méthode de définition)
    const botVersion = packageJson.version; // Utilise la version depuis package.json
    // const botVersion = "1.0.0"; // Utilise une version définie directement dans le code

    // Définir l'activité du bot avec la version
    try {
      await client.user.setPresence({
        activities: [
          {
            name: `Version ${packageJson.version}`, // Afficher la version du bot
            type: ActivityType.Watching // Utilise ActivityType.Watching pour "WATCHING"
          }
        ],
        status: 'dnd' // Statut: do not disturb
      });
      console.log('Présence mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
    }

    console.log(`[Bot] => ${client.user.username} is online with version ${botVersion}`);
  },
};
