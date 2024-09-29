import { WebSocketServer } from 'ws';
import { generate52Cards, get5Cards, calCardsInfo, compareCardSize } from './common.mjs';

// 玩家类，包含 ID、名称、筹码等属性
class Player {
    constructor(id, name, chips) {
        this.id = id;
        this.name = name;
        this.chips = chips;
        this.cards = [];
        this.currentBet = 0;
    }

    bet(amount) {
        if (amount <= this.chips) {
            this.chips -= amount;
            this.currentBet = amount;
        } else {
            throw new Error('筹码不足');
        }
    }

    resetBet() {
        this.currentBet = 0;
    }
}

let players = [];
const playerNumber = 2;
let cardsDeck = [];

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    const id = players.length + 1;
    const name = `玩家${id}`;
    const player = new Player(id, name, 1000); // 每个玩家初始筹码为 1000
    players.push(player);
    ws.send(JSON.stringify({ message: `欢迎 ${name}, 您的筹码是 ${player.chips}` }));

    ws.on('message', (data) => {
        const action = JSON.parse(data);
        handlePlayerAction(ws, player, action);
    });
});

const handlePlayerAction = (ws, player, action) => {
    switch (action.type) {
        case 'bet':
            try {
                player.bet(action.amount);
                ws.send(JSON.stringify({ message: `${player.name} 下注 ${action.amount}，剩余筹码 ${player.chips}` }));
            } catch (error) {
                ws.send(JSON.stringify({ error: error.message }));
            }
            break;
        // 可以扩展其他动作，例如 "fold"、"raise" 等
        default:
            ws.send(JSON.stringify({ error: '未知操作' }));
    }
};

// 开始游戏
const startGame = () => {
    cardsDeck = generate52Cards();

    // 分发手牌
    players.forEach(player => {
        player.cards = calCardsInfo(get5Cards(cardsDeck));
        player.resetBet(); // 重置每个玩家的下注
    });

    // 计算牌型并比较大小
    compareCardSize(players);
};

// 示例：每 60 秒自动开始一局游戏
setInterval(startGame, 60000);
