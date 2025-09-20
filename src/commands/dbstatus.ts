import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { DatabaseService } from '../utils/database';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dbstatus')
        .setDescription('檢查資料庫連接狀態')
        .setDefaultMemberPermissions(null),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const dbService = DatabaseService.getInstance();
            const connectionInfo = dbService.getConnectionInfo() as any;
            const isConnected = dbService.isConnectedToDatabase();

            const embed = new EmbedBuilder()
                .setTitle('🗄️ 資料庫狀態')
                .setColor(isConnected ? '#00FF00' : '#FF0000')
                .addFields(
                    { name: '連接狀態', value: isConnected ? '✅ 已連接' : '❌ 未連接', inline: true },
                    { name: '詳細狀態', value: connectionInfo.readyStateDescription, inline: true },
                    { name: '重連次數', value: connectionInfo.reconnectAttempts.toString(), inline: true },
                    { name: '心跳檢測', value: connectionInfo.hasHeartbeat ? '✅ 運行中' : '❌ 停止', inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error checking database status:', error);
            await interaction.reply({ 
                content: '❌ 檢查資料庫狀態時發生錯誤', 
                ephemeral: true 
            });
        }
    },
};
