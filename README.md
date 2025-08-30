# Tyr - Discord Bot

A modern Discord bot built with Discord.js v14 and TypeScript, featuring slash commands, event handling, and a modular architecture.

## 🚀 Features

- ✅ **Slash Commands** - Modern Discord interactions
- ✅ **TypeScript** - Type-safe development
- ✅ **Modular Architecture** - Easy to extend and maintain
- ✅ **Event Handling** - Responds to Discord events
- ✅ **Auto-reload** - Development server with hot reload
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Ready to Deploy** - Production-ready configuration
- ✅ **Voice Activity Logging** - MongoDB-powered voice channel tracking
- ✅ **Database Integration** - Mongoose ODM with MongoDB support

## 📋 Prerequisites

Before you begin, make sure you have completed the steps in `BEFORE-SETUP.md`:

- ✅ Discord bot created in Developer Portal
- ✅ Bot token obtained and secured
- ✅ Bot invited to test server
- ✅ Node.js 16+ installed
- ✅ Environment variables configured

## 🛠️ Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your bot token and client ID
   ```

3. **Deploy slash commands:**
   ```bash
   npm run deploy-commands
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Tyr/
├── src/
│   ├── commands/          # Slash commands
│   │   ├── apexmap.ts     # Apex Legends map rotation command
│   │   ├── hello.ts       # Hello command with optional name
│   │   ├── info.ts        # Bot information embed
│   │   ├── ping.ts        # Latency check command
│   │   └── whoLeft.ts     # Voice channel "who left" command
│   ├── events/            # Discord event handlers
│   │   ├── ready.ts       # Bot ready event
│   │   ├── guildCreate.ts # New server joined event
│   │   └── voiceStateUpdate.ts # Voice state change logging
│   ├── models/            # Database models
│   │   └── VoiceLog.ts    # Voice activity log model
│   ├── types/             # TypeScript definitions
│   │   └── Command.ts     # Command interface
│   ├── utils/             # Utility functions
│   │   ├── apexService.ts # Apex Legends API service
│   │   ├── database.ts    # MongoDB connection service
│   │   ├── deploy-commands.ts # Command deployment script
│   │   └── voiceLogService.ts # Voice logging service
│   └── index.ts           # Main bot file
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config
├── BEFORE-SETUP.md       # Pre-development checklist
└── README.md             # This file
```

## 🎮 Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/ping` | Check bot latency | `/ping` |
| `/info` | Display bot information | `/info` |
| `/hello` | Greet user with optional name | `/hello [name]` |
| `/apexmap` | Get Apex Legends map rotation (Normal/Ranked) | `/apexmap mode:normal/ranked` |
| `/誰啦` | Find who last left your voice channel | `/誰啦` |

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run deploy-commands` | Deploy slash commands to Discord |

## 🔧 Development

### Adding New Commands

1. Create a new file in `src/commands/` (e.g., `mycommand.ts`)
2. Use this template:

```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mycommand')
        .setDescription('My awesome command'),
    
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Hello from my command!');
    },
};
```

3. Run `npm run deploy-commands` to register the new command
4. Restart the bot with `npm run dev`

### Adding New Events

1. Create a new file in `src/events/` (e.g., `myevent.ts`)
2. Use this template:

```typescript
import { Events } from 'discord.js';

module.exports = {
    name: Events.MessageCreate, // Or any Discord.js event
    execute(message) {
        // Handle the event
        console.log(`New message: ${message.content}`);
    },
};
```

3. Restart the bot to load the new event handler

## 🌐 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Make sure these are set in production:

- `DISCORD_TOKEN` - Your bot's token
- `CLIENT_ID` - Your application's client ID

## 🐛 Troubleshooting

### Common Issues

1. **Commands not appearing in Discord**
   - Run `npm run deploy-commands`
   - Wait up to 1 hour for global commands to sync
   - Check bot permissions in server

2. **Bot not responding**
   - Verify token is correct in `.env`
   - Check bot has necessary permissions
   - Check console for error messages

3. **TypeScript errors**
   - Run `npm run build` to check for type errors
   - Ensure all dependencies are installed

### Getting Help

- Check the `BEFORE-SETUP.md` file for setup issues
- Review Discord.js documentation
- Check the console logs for error messages

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Ready to build something amazing?** 🚀

Your Discord bot is now ready for development. All the boilerplate code is set up, and you can start adding your own commands and features immediately!
