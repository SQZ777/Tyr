import { Events, VoiceState } from 'discord.js';
import { VoiceLogService } from '../utils/voiceLogService';

const voiceLogService = VoiceLogService.getInstance();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState: VoiceState, newState: VoiceState) {
        try {
            await voiceLogService.logVoiceStateUpdate(oldState, newState);
        } catch (error) {
            console.error('❌ Error in voice state update handler:', error);
        }
    },
};
