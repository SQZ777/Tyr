import mongoose from 'mongoose';

export class DatabaseService {
    private static instance: DatabaseService;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
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

            await mongoose.connect(mongoUri);
            this.isConnected = true;
            console.log('🗄️ Connected to MongoDB successfully');

            // 監聽連接事件
            mongoose.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('🔌 MongoDB disconnected');
                this.isConnected = false;
            });

        } catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error);
            this.isConnected = false;
        }
    }

    public async disconnect(): Promise<void> {
        try {
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
}
