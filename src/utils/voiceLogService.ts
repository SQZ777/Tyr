import { VoiceLog, IVoiceLog } from '../models/VoiceLog';
import { DatabaseService } from './database';
import { VoiceState, Guild, VoiceChannel } from 'discord.js';

export class VoiceLogService {
    private static instance: VoiceLogService;
    private dbService: DatabaseService;

    private constructor() {
        this.dbService = DatabaseService.getInstance();
    }

    public static getInstance(): VoiceLogService {
        if (!VoiceLogService.instance) {
            VoiceLogService.instance = new VoiceLogService();
        }
        return VoiceLogService.instance;
    }

    /**
     * 確保資料庫連接並執行操作
     */
    private async ensureDatabaseConnection(): Promise<boolean> {
        if (this.dbService.isConnectedToDatabase()) {
            return true;
        }

        console.log('⚠️ Database connection lost, attempting to reconnect...');
        return await this.dbService.ensureConnection();
    }

    /**
     * 記錄使用者語音頻道狀態變化
     */
    public async logVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): Promise<void> {
        try {
            // 確保資料庫連接
            const isConnected = await this.ensureDatabaseConnection();
            if (!isConnected) {
                console.log('⚠️ Database not available, skipping voice log');
                return;
            }

            const user = newState.member?.user || oldState.member?.user;
            const guild = newState.guild || oldState.guild;

            if (!user || !guild) {
                return;
            }

            // 忽略機器人
            if (user.bot) {
                return;
            }

            const oldChannel = oldState.channel;
            const newChannel = newState.channel;

            // 決定動作類型
            let action: 'join' | 'leave' | 'move';
            if (!oldChannel && newChannel) {
                action = 'join';
            } else if (oldChannel && !newChannel) {
                action = 'leave';
            } else if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
                action = 'move';
            } else {
                // 其他狀態變化（如靜音、關閉攝影機等）不記錄
                return;
            }

            const logData = {
                userId: user.id,
                username: user.displayName || user.username,
                timestamp: new Date(),
                previousChannelId: oldChannel?.id,
                previousChannelName: oldChannel?.name,
                newChannelId: newChannel?.id,
                newChannelName: newChannel?.name,
                action,
                guildId: guild.id,
                guildName: guild.name
            };

            await VoiceLog.create(logData);
            console.log(`📝 Voice log saved: ${user.username} ${action} ${newChannel?.name || oldChannel?.name}`);

        } catch (error) {
            console.error('❌ Error saving voice log:', error);
            
            // 如果是連接錯誤，記錄更詳細的資訊
            if (error instanceof Error && error.message.includes('connection')) {
                console.log('🔍 Database connection info:', this.dbService.getConnectionInfo());
            }
        }
    }

    /**
     * 查詢指定頻道最後一個離開的使用者
     */
    public async getLastUserLeftChannel(channelId: string, guildId: string): Promise<IVoiceLog | null> {
        try {
            const isConnected = await this.ensureDatabaseConnection();
            if (!isConnected) {
                console.log('⚠️ Database not available for query');
                return null;
            }

            // 查詢最近一次從該頻道離開的使用者
            const lastLeftUser = await VoiceLog.findOne({
                guildId,
                $or: [
                    { previousChannelId: channelId, action: 'leave' },
                    { previousChannelId: channelId, action: 'move' }
                ]
            })
            .sort({ timestamp: -1 })
            .exec();

            return lastLeftUser;

        } catch (error) {
            console.error('❌ Error querying voice logs:', error);
            return null;
        }
    }

    /**
     * 查詢使用者的語音活動歷史
     */
    public async getUserVoiceHistory(userId: string, guildId: string, limit: number = 10): Promise<IVoiceLog[]> {
        try {
            const isConnected = await this.ensureDatabaseConnection();
            if (!isConnected) {
                return [];
            }

            const history = await VoiceLog.find({
                userId,
                guildId
            })
            .sort({ timestamp: -1 })
            .limit(limit)
            .exec();

            return history;

        } catch (error) {
            console.error('❌ Error querying user voice history:', error);
            return [];
        }
    }

    /**
     * 查詢頻道的活動歷史
     */
    public async getChannelVoiceHistory(channelId: string, guildId: string, limit: number = 20): Promise<IVoiceLog[]> {
        try {
            const isConnected = await this.ensureDatabaseConnection();
            if (!isConnected) {
                return [];
            }

            const history = await VoiceLog.find({
                guildId,
                $or: [
                    { newChannelId: channelId },
                    { previousChannelId: channelId }
                ]
            })
            .sort({ timestamp: -1 })
            .limit(limit)
            .exec();

            return history;

        } catch (error) {
            console.error('❌ Error querying channel voice history:', error);
            return [];
        }
    }
}
