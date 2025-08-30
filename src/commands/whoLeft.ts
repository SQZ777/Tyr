import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { VoiceLogService } from '../utils/voiceLogService';

const voiceLogService = VoiceLogService.getInstance();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('誰啦')
        .setDescription('查詢最近一次離開你所在語音頻道的人')
        .setDefaultMemberPermissions(null), // 所有使用者都能使用
    
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            // 檢查使用者是否在語音頻道中
            const member = interaction.member as GuildMember;
            if (!member || !member.voice.channel) {
                await interaction.reply({
                    content: '沒在頻道吵什麼吵 🙄',
                    ephemeral: true
                });
                return;
            }

            await interaction.deferReply();

            const currentChannelId = member.voice.channel.id;
            const guildId = interaction.guildId!;

            // 查詢最後一個離開該頻道的使用者
            const lastLeftUser = await voiceLogService.getLastUserLeftChannel(currentChannelId, guildId);

            if (!lastLeftUser) {
                const embed = new EmbedBuilder()
                    .setTitle('🤔 查無紀錄')
                    .setDescription(`在 **${member.voice.channel.name}** 頻道中沒有找到最近離開的紀錄`)
                    .setColor('#FFA500')
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                return;
            }

            // 計算離開時間
            const leftTime = lastLeftUser.timestamp;
            const now = new Date();
            const timeDiff = now.getTime() - leftTime.getTime();
            
            // 格式化時間差
            const minutes = Math.floor(timeDiff / (1000 * 60));
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            let timeAgo = '';
            if (days > 0) {
                timeAgo = `${days} 天前`;
            } else if (hours > 0) {
                timeAgo = `${hours} 小時前`;
            } else if (minutes > 0) {
                timeAgo = `${minutes} 分鐘前`;
            } else {
                timeAgo = '剛剛';
            }

            // 決定動作描述
            let actionText = '';
            if (lastLeftUser.action === 'leave') {
                actionText = '離開了';
            } else if (lastLeftUser.action === 'move') {
                actionText = `轉移到 **${lastLeftUser.newChannelName}**`;
            }

            const embed = new EmbedBuilder()
                .setTitle('🔍 找到了！')
                .setDescription(
                    `最後一個離開 **${member.voice.channel.name}** 的是：\n\n` +
                    `👤 **${lastLeftUser.username}**\n` +
                    `🚪 ${actionText}\n` +
                    `⏰ 時間：${timeAgo}（${leftTime.toLocaleString('zh-TW')}）`
                )
                .setColor('#00FF00')
                .setTimestamp()
                .setFooter({ 
                    text: `由 ${interaction.user.tag} 查詢`, 
                    iconURL: interaction.user.displayAvatarURL() 
                });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error in 誰啦 command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ 錯誤')
                .setDescription('查詢時發生錯誤，請稍後再試')
                .setColor('#FF0000')
                .setTimestamp();

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
