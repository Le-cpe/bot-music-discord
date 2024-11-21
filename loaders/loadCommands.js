const { readdirSync } = require("fs");

module.exports = async client => {

  let count = 0;
  const dirsCommands = readdirSync("./commands/");

  for (const dir of dirsCommands) {
    const filesDirs = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));
    for (const file of filesDirs) {
      const command = require(`../commands/${dir}/${file}`);
      
      // Vérifie si la commande est une commande slash (avec command.data.name)
      if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
      }
      
      // Vérifie si c'est une commande en préfixe (avec command.name)
      if (command.name) {
        client.prefixCommands.set(command.name, command);
      }

      count++;
    }
  }

  console.log(`[Commands] ${count} loaded commands!`);
};
