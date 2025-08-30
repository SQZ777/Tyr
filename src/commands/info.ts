import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information about the bot')
        .setDefaultMemberPermissions(null), // 所有使用者都能使用
    
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 Bot Information')
            .setDescription('Tyr - A powerful Discord bot built with Discord.js')
            .addFields(
                { name: '📊 Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: '👥 Users', value: `${interaction.client.users.cache.size}`, inline: true },
                { name: '📱 Commands', value: `${(interaction.client as any).commands?.size || 0}`, inline: true },
                { name: '🔗 Ping', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
                { name: '⏰ Uptime', value: `${Math.floor((interaction.client.uptime || 0) / 1000 / 60)} minutes`, inline: true },
                { name: '🏷️ Version', value: '1.0.0', inline: true }
            )
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL() 
            });

        await interaction.reply({ embeds: [embed] });
    },
};
