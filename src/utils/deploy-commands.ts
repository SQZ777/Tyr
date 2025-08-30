import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

// Load all commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`⚠️ [WARNING] Command at ${filePath} is missing required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// Deploy commands
(async () => {
    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

        // 檢查是否有設定測試伺服器 ID
        const guildId = process.env.GUILD_ID;
        
        if (guildId) {
            // 部署到特定伺服器（立即生效）
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId),
                { body: commands },
            ) as any[];
            console.log(`✅ Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`);
        } else {
            // 部署到全域（需要 1 小時同步）
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: commands },
            ) as any[];
            console.log(`✅ Successfully reloaded ${data.length} application (/) commands globally.`);
            console.log(`⏰ Note: Global commands may take up to 1 hour to sync to all users.`);
        }
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
