import mongoose from 'mongoose';

export class DatabaseService {
    private static instance: DatabaseService;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectInterval: number = 5000; // 5 seconds
    private heartbeatInterval?: NodeJS.Timeout;

    private constructor() {
        this.setupEventListeners();
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    private setupEventListeners(): void {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
            this.isConnected = false;
            this.stopHeartbeat();
            this.handleReconnection();
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        });
    }

    private startHeartbeat(): void {
        // 每 30 秒檢查一次連接狀態
        this.heartbeatInterval = setInterval(async () => {
            try {
                if (mongoose.connection.db) {
                    await mongoose.connection.db.admin().ping();
                    if (!this.isConnected) {
                        console.log('🔄 Database ping successful, connection restored');
                        this.isConnected = true;
                    }
                }
            } catch (error) {
                console.warn('⚠️ Database ping failed:', error);
                this.isConnected = false;
            }
        }, 30000);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
        }
    }

    private async handleReconnection(): Promise<void> {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error(`❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached`);
            return;
        }

        this.reconnectAttempts++;
        console.log(`🔄 Attempting to reconnect to MongoDB (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

        setTimeout(async () => {
            try {
                const mongoUri = process.env.MONGODB_URI;
                if (mongoUri) {
                    await mongoose.connect(mongoUri);
                }
            } catch (error) {
                console.error(`❌ Reconnection attempt ${this.reconnectAttempts} failed:`, error);
            }
        }, this.reconnectInterval * this.reconnectAttempts); // 遞增延遲
    }

    public async connect(): Promise<void> {
        try {
            const mongoUri = process.env.MONGODB_URI;
            if (!mongoUri) {
                console.warn('⚠️ MONGODB_URI not found in environment variables. Voice logging will be disabled.');
                return;
            }

            if (this.isConnected) {
                console.log('📦 Already connected to MongoDB');
                return;
            }

            // 優化的連接選項
            await mongoose.connect(mongoUri, {
                maxPoolSize: 10, // 最大連接池大小
                serverSelectionTimeoutMS: 5000, // 伺服器選擇超時
                socketTimeoutMS: 45000, // Socket 超時
                family: 4, // 使用 IPv4
                bufferCommands: false, // 禁用 mongoose 緩衝
            });

            this.isConnected = true;
            console.log('🗄️ Connected to MongoDB successfully');

        } catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error);
            this.isConnected = false;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            this.stopHeartbeat();
            if (this.isConnected) {
                await mongoose.disconnect();
                this.isConnected = false;
                console.log('🔌 Disconnected from MongoDB');
            }
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
        }
    }

    public isConnectedToDatabase(): boolean {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    /**
     * 檢查並確保資料庫連接
     */
    public async ensureConnection(): Promise<boolean> {
        if (this.isConnectedToDatabase()) {
            return true;
        }

        try {
            console.log('🔄 Database connection lost, attempting to reconnect...');
            await this.connect();
            return this.isConnectedToDatabase();
        } catch (error) {
            console.error('❌ Failed to ensure database connection:', error);
            return false;
        }
    }

    /**
     * 獲取連接狀態資訊
     */
    public getConnectionInfo(): object {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            readyStateDescription: this.getReadyStateDescription(),
            reconnectAttempts: this.reconnectAttempts,
            hasHeartbeat: !!this.heartbeatInterval
        };
    }

    private getReadyStateDescription(): string {
        switch (mongoose.connection.readyState) {
            case 0: return 'disconnected';
            case 1: return 'connected';
            case 2: return 'connecting';
            case 3: return 'disconnecting';
            default: return 'unknown';
        }
    }
}
