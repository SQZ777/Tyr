# Discord Bot Setup Guide - Before You Start

## Prerequisites Checklist

### 1. Discord Developer Account Setup
- [ ] Create a Discord account if you don't have one at [discord.com](https://discord.com)
- [ ] Go to [Discord Developer Portal](https://discord.com/developers/applications)
- [ ] Click "New Application" and give it a name (e.g., "Tyr Bot")
- [ ] Navigate to the "Bot" section in the left sidebar
- [ ] Click "Add Bot" to create a bot user
- [ ] Under "Token" section, click "Copy" to copy your bot token
- [ ] **IMPORTANT**: Save this token securely - you'll need it for the `.env` file

### 2. Bot Permissions & Invite Link
- [ ] In the Developer Portal, go to "OAuth2" > "URL Generator"
- [ ] Select "bot" in the SCOPES section
- [ ] Select the following BOT PERMISSIONS:
  - [ ] Read Messages/View Channels
  - [ ] Send Messages
  - [ ] Send Messages in Threads
  - [ ] Embed Links
  - [ ] Attach Files
  - [ ] Read Message History
  - [ ] Use Slash Commands
  - [ ] Connect (for voice if needed)
  - [ ] Speak (for voice if needed)
- [ ] Copy the generated URL
- [ ] Open the URL and invite your bot to a test server

### 3. Environment Setup
- [ ] Create a `.env` file in the project root
- [ ] Add your bot token: `DISCORD_TOKEN=your_bot_token_here`
- [ ] Add your client ID: `CLIENT_ID=your_application_id_here`
- [ ] **NEVER commit the `.env` file to version control**

### 4. Test Server Setup
- [ ] Create a Discord server for testing (or use an existing one where you have admin rights)
- [ ] Invite your bot using the URL from step 2
- [ ] Ensure the bot appears in the member list
- [ ] Create a test channel for command testing

### 5. Development Environment
- [ ] Ensure Node.js 16+ is installed (`node --version`)
- [ ] Ensure npm/yarn is available (`npm --version`)
- [ ] Install VS Code extensions (will be auto-suggested when you open the project):
  - [ ] TypeScript and JavaScript Language Features
  - [ ] ESLint
  - [ ] Prettier
  - [ ] Discord.js IntelliSense

### 6. Apex Legends API Setup (Optional)
- [ ] Visit [Apex Legends API](https://apexlegendsapi.com/) 
- [ ] Register for a free API key
- [ ] Add `APEX_STATUS_API_KEY=your_api_key_here` to your `.env` file
- [ ] This enables the `/apexmap` command for map rotation info

## Quick Start Commands

Once prerequisites are complete:

```bash
# Install dependencies (if not already done)
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## File Structure Overview

```
Tyr/
├── src/
│   ├── commands/          # Slash commands
│   ├── events/           # Discord event handlers
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Main bot file
├── .env                  # Environment variables (create this)
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Common Issues & Solutions

### Bot Not Responding
- ✅ Check if bot token is correct in `.env`
- ✅ Verify bot has necessary permissions in the server
- ✅ Ensure bot is online (green status in Discord)
- ✅ Check console for error messages

### Slash Commands Not Appearing
- ✅ Commands need to be registered with Discord API
- ✅ Run `npm run deploy-commands` after adding new commands
- ✅ Wait up to 1 hour for global commands to sync

### Permission Errors
- ✅ Bot needs specific permissions for each action
- ✅ Check bot role hierarchy in server settings
- ✅ Ensure bot role has necessary permissions

## Security Best Practices

- 🔒 Never share your bot token publicly
- 🔒 Use environment variables for sensitive data
- 🔒 Add `.env` to `.gitignore`
- 🔒 Regularly rotate bot tokens if compromised
- 🔒 Use least privilege principle for bot permissions

## Next Steps

After completing this checklist:
1. Run `npm run dev` to start the development server
2. Test basic bot functionality in your Discord server
3. Explore the example commands in `src/commands/`
4. Read the main README.md for detailed development guidelines

---

**Ready to start coding?** All the boilerplate is prepared - you won't need to write a single line of setup code! 🚀
