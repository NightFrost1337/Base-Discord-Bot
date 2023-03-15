const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require("fs");
const Enmap = require("enmap");

const config = require("./config.json");
client.config = config;

client.commands = new Enmap();

console.log("------------------------------------------------");

fs.readdir("./events", (err, eventFiles) => {
  if (err) console.error;
  
  eventFiles.forEach((eventFile) => {
    if (!eventFile.endsWith(".js")) return;

    const eventName = eventFile.split(".")[0];
    const event = require(`./events/${eventFile}`);

    console.log(`Loaded event '${eventName}'`);

    client.on(eventName, (...args) => event(client, ...args));
  });

  console.log("------------------------------------------------");
});

fs.readdir("./commands", (err, commandFiles) => {
  if (err) console.error;
  
  commandFiles.forEach((commandFile) => {
    if (!commandFile.endsWith(".js")) return;

    const commandName = commandFile.split(".")[0];
    const props = require(`./commands/${commandFile}`);

    console.log(`Loaded command '${commandName}'`);

    client.commands.set(commandName, props);
  });

  console.log("------------------------------------------------");
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.login(config.token || process.env.TOKEN);
