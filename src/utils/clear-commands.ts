import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';

// Load environment variables
config();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// Clear commands
(async () => {
    try {
        const guildId = process.env.GUILD_ID;
        
        if (guildId) {
            // 清空特定伺服器的命令
            console.log('🧹 Clearing guild-specific commands...');
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId),
                { body: [] },
            );
            console.log(`✅ Successfully cleared all guild commands for guild ${guildId}.`);
        } else {
            // 清空全域命令
            console.log('🧹 Clearing global commands...');
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: [] },
            );
            console.log('✅ Successfully cleared all global commands.');
            console.log('⏰ Note: Global command changes may take up to 1 hour to sync to all users.');
        }
        
        console.log('🎉 Command clearing completed! You can now manually deploy new commands.');
    } catch (error) {
        console.error('❌ Error clearing commands:', error);
    }
})();
