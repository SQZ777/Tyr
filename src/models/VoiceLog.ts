import mongoose, { Schema, Document } from 'mongoose';

export interface IVoiceLog extends Document {
    userId: string;
    username: string;
    timestamp: Date;
    previousChannelId?: string;
    previousChannelName?: string;
    newChannelId?: string;
    newChannelName?: string;
    action: 'join' | 'leave' | 'move';
    guildId: string;
    guildName: string;
}

const VoiceLogSchema: Schema = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    previousChannelId: { type: String },
    previousChannelName: { type: String },
    newChannelId: { type: String },
    newChannelName: { type: String },
    action: { type: String, enum: ['join', 'leave', 'move'], required: true },
    guildId: { type: String, required: true },
    guildName: { type: String, required: true }
});

// 建立索引以提高查詢效能
VoiceLogSchema.index({ guildId: 1, timestamp: -1 });
VoiceLogSchema.index({ userId: 1, timestamp: -1 });
VoiceLogSchema.index({ newChannelId: 1, timestamp: -1 });
VoiceLogSchema.index({ previousChannelId: 1, timestamp: -1 });

export const VoiceLog = mongoose.model<IVoiceLog>('VoiceLog', VoiceLogSchema);
