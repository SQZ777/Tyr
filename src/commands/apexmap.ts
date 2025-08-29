import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ApexService } from '../utils/apexService';

const apexService = new ApexService();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apexmap')
        .setDescription('查詢 Apex Legends 地圖輪換資訊')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('選擇遊戲模式')
                .setRequired(true)
                .addChoices(
                    { name: '🎮 一般遊戲 (Battle Royale)', value: 'normal' },
                    { name: '🏆 排位遊戲 (Ranked)', value: 'ranked' }
                )
        ),
    
    async execute(interaction: ChatInputCommandInteraction) {
        // 延遲回應，因為 API 請求可能需要時間
        await interaction.deferReply();

        try {
            const gameMode = interaction.options.getString('mode', true) as 'normal' | 'ranked';
            const mapInfo = await apexService.getMapRotation(gameMode);
            
            // 根據遊戲模式選擇顏色和標題
            const embedColor = gameMode === 'normal' ? '#FF6B35' : '#9B59B6'; // 橘色 vs 紫色
            const embedTitle = gameMode === 'normal' ? '🎮 Apex Legends - 一般遊戲' : '🏆 Apex Legends - 排位遊戲';
            
            // 創建美觀的嵌入式訊息
            const embed = new EmbedBuilder()
                .setTitle(embedTitle)
                .setDescription(mapInfo)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({ 
                    text: `由 ${interaction.user.tag} 請求`, 
                    iconURL: interaction.user.displayAvatarURL() 
                });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('執行 apexmap 命令時發生錯誤:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ 錯誤')
                .setDescription('無法取得地圖資訊，請稍後再試')
                .setColor('#FF0000')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
