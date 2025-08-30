import axios from 'axios';

// Apex Legends 地圖名稱映射
const MAPS: { [key: string]: string } = {
    'World\'s Edge': '世界邊緣',
    'Kings Canyon': '王者峽谷 黃雀峽谷',
    'Olympus': '奧林匹斯',
    'Storm Point': '風暴點 P眼點',
    'Broken Moon': '殘月',
    'E-District': '電流區',
    'Habitat': '棲息地',
    'Caustic Treatment': '腐蝕處理廠',
    'Zeus Station': '宙斯站',
    'Barometer': '氣壓計',
    'Command Center': '指揮中心',
    'Launch Site': '發射場',
    'Dome': '圓頂',
    'Phase Runner': '相位跑道',
    'Encore': '安可',
    'Overflow': '溢流',
    'Party Crasher': '派對破壞者',
    'Estates': '莊園區',
    'Oasis': '綠洲',
    'Launch Pad': '發射台',
    'Drop Off': '下車點',
    'Thunderdome': '雷鳴競技場',
    'Production': '生產區',
    'Genesis': '創世紀',
    'Cleo Recovery': '克萊奧回收站',
    'Promenade': '長廊'
};

interface ApexMapInfo {
    start: number;
    end: number;
    readableDate_start: string;
    readableDate_end: string;
    map: string;
    code: string;
    DurationInSecs: number;
    DurationInMinutes: number;
    asset: string;
    remainingSecs?: number;
    remainingMins?: number;
    remainingTimer?: string;
    isActive?: boolean;
    eventName?: string;
}

interface ApexMapRotation {
    current: ApexMapInfo;
    next: ApexMapInfo;
}

interface ApexMapRotationV2 {
    battle_royale: ApexMapRotation;
    ranked: ApexMapRotation;
    ltm: ApexMapRotation;
}

export class ApexService {
    private readonly apiKey: string;
    
    constructor() {
        this.apiKey = process.env.APEX_STATUS_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ APEX_STATUS_API_KEY not found in environment variables');
        }
    }

    /**
     * 獲取 Apex Legends 地圖輪換資訊
     * @param gameMode 遊戲模式：'normal' (一般遊戲) 或 'ranked' (排位遊戲)
     */
    async getMapRotation(gameMode: 'normal' | 'ranked'): Promise<string> {
        try {
            if (!this.apiKey) {
                return '❌ API 金鑰未設定，請聯絡管理員設定 APEX_STATUS_API_KEY';
            }

            const response = await axios.get<ApexMapRotationV2>(
                `https://api.mozambiquehe.re/maprotation?auth=${this.apiKey}&version=2`,
                {
                    timeout: 10000, // 10 秒逾時
                    headers: {
                        'User-Agent': 'Discord Bot - Tyr'
                    }
                }
            );

            if (response.status === 200 && response.data) {
                const rotationData = gameMode === 'normal' ? response.data.battle_royale : response.data.ranked;
                return this.formatMapInfo(rotationData, gameMode);
            } else {
                throw new Error(`API 回應狀態碼: ${response.status}`);
            }
        } catch (error) {
            console.error('取得 Apex 地圖資訊時發生錯誤:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    return '⏰ 請求逾時，請稍後再試';
                } else if (error.response?.status === 401) {
                    return '🔑 API 金鑰無效，請聯絡管理員';
                } else if (error.response?.status === 429) {
                    return '🚫 API 請求次數過多，請稍後再試';
                }
            }
            
            return '❌ 目前無法查詢地圖資訊，請稍後再試或聯絡管理員';
        }
    }

    /**
     * 獲取當前 Apex Legends 地圖輪換資訊 (向後相容)
     * @deprecated 請使用 getMapRotation('normal') 替代
     */
    async getCurrentMap(): Promise<string> {
        return this.getMapRotation('normal');
    }

    /**
     * 格式化地圖資訊為友善的訊息
     */
    private formatMapInfo(data: ApexMapRotation, gameMode: 'normal' | 'ranked'): string {
        const currentMap = data.current;
        const nextMap = data.next;

        const currentMapName = MAPS[currentMap.map] || currentMap.map;
        const nextMapName = MAPS[nextMap.map] || nextMap.map;

        const gameModeText = gameMode === 'normal' ? '一般遊戲' : '排位遊戲';
        const gameModeEmoji = gameMode === 'normal' ? '🎮' : '🏆';

        return `${gameModeEmoji} **Apex Legends ${gameModeText} 地圖輪換**\n\n` +
               `📍 **目前地圖**: ${currentMapName}\n` +
               `⏱️ **剩餘時間**: ${currentMap.remainingTimer || '計算中...'}\n` +
               `⏳ **持續時間**: ${currentMap.DurationInMinutes} 分鐘\n` +
               `🕐 **開始時間**: ${currentMap.readableDate_start}\n` +
               `🕐 **結束時間**: ${currentMap.readableDate_end}\n\n` +
               `🔄 **下一張地圖**: ${nextMapName}\n` +
               `⏰ **切換時間**: ${nextMap.readableDate_start}\n` +
               `⏳ **下張持續**: ${nextMap.DurationInMinutes} 分鐘`;
    }

    /**
     * 取得所有支援的地圖列表
     */
    getSupportedMaps(): string[] {
        return Object.keys(MAPS);
    }
}
