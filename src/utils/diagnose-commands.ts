import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';

// Load environment variables
config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
const guildId = process.env.GUILD_ID;

// 檢查命令狀況
(async () => {
    try {
        console.log('🔍 開始診斷 Discord 命令狀況...\n');
        
        if (guildId) {
            console.log(`📍 檢查 Guild ID: ${guildId} 的命令`);
            
            // 獲取 guild-specific 命令
            const guildCommands = await rest.get(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId)
            ) as any[];
            
            console.log(`✅ Guild 命令數量: ${guildCommands.length}`);
            guildCommands.forEach((cmd, index) => {
                console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description}`);
                console.log(`      權限: ${cmd.default_member_permissions || '所有人'}`);
            });
        }
        
        // 獲取全域命令
        console.log('\n🌍 檢查全域命令');
        const globalCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID!)
        ) as any[];
        
        console.log(`✅ 全域命令數量: ${globalCommands.length}`);
        globalCommands.forEach((cmd, index) => {
            console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description}`);
            console.log(`      權限: ${cmd.default_member_permissions || '所有人'}`);
        });
        
        // 檢查 Bot 資訊
        console.log('\n🤖 檢查 Bot 資訊');
        const application = await rest.get('/applications/@me') as any;
        console.log(`✅ Bot 名稱: ${application.name}`);
        console.log(`✅ Bot ID: ${application.id}`);
        
        console.log('\n💡 建議排查步驟:');
        console.log('1. 重新啟動 Discord 用戶端');
        console.log('2. 檢查 Bot 是否有 applications.commands 權限');
        console.log('3. 確認伺服器中沒有特殊的角色權限限制');
        console.log('4. 嘗試在其他頻道輸入斜線命令');
        
    } catch (error) {
        console.error('❌ 診斷過程中發生錯誤:', error);
    }
})();
