<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Discord Bot Development Instructions

This is a Discord bot project built with Discord.js v14 and TypeScript. When working on this codebase:

## Code Style & Patterns
- Use TypeScript for all new files
- Use async/await instead of promises where possible
- Use proper error handling with try-catch blocks
- Follow Discord.js v14 patterns and best practices
- Use slash commands (/) instead of legacy prefix commands
- Use proper typing with the Command interface from types/Command.ts

## File Organization
- Commands go in `src/commands/` directory
- Events go in `src/events/` directory
- Utility functions go in `src/utils/` directory
- Type definitions go in `src/types/` directory
- Follow the existing file naming conventions

## Discord.js Specific
- Always use ChatInputCommandInteraction for slash commands
- Use proper embeds for rich message content
- Handle permissions properly before executing commands
- Use ephemeral responses for error messages when appropriate
- Always validate user input and provide helpful error messages

## Environment & Configuration
- Never hardcode tokens or sensitive data
- Use environment variables from .env file
- Always check for required environment variables at startup
- Use the deploy-commands script to register new slash commands

## Error Handling
- Always handle errors gracefully
- Log errors to console with descriptive messages
- Send user-friendly error messages to Discord
- Use ephemeral responses for error messages
