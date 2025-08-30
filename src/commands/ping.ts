import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong and shows bot latency!')
        .setDefaultMemberPermissions(null), // 所有使用者都能使用
    
    async execute(interaction: ChatInputCommandInteraction) {
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            fetchReply: true 
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        await interaction.editReply(
            `🏓 **Pong!**\n` +
            `📡 **Latency:** ${latency}ms\n` +
            `💝 **API Latency:** ${apiLatency}ms`
        );
    },
};
