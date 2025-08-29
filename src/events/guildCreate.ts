import { Events, Guild } from 'discord.js';

module.exports = {
    name: Events.GuildCreate,
    execute(guild: Guild) {
        console.log(`✅ Joined new guild: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    },
};
