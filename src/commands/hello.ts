import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello to you!')
        .setDefaultMemberPermissions(null) // 所有使用者都能使用
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Your name')
                .setRequired(false)
        ),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name');
        const user = interaction.user;
        
        if (name) {
            await interaction.reply(`👋 Hello there, **${name}**! Nice to meet you!`);
        } else {
            await interaction.reply(`👋 Hello, **${user.displayName}**! How are you doing today?`);
        }
    },
};
