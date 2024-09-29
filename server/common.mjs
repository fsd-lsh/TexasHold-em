const colors = ['♠️','♥️','♣️','♦️']
const values = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
const Map = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    10: "皇家同花顺",
    9: "同花顺",
    8: "四条",
    7: "葫芦",
    6: "同花",
    5: "顺子",
    4: "三条",
    3: "两对",
    2: "一对",
    1: "散牌",
}
const generate52Cards = () => {
    let cards = []
    for(let i = 0; i < colors.length; i++){
        for(let j = 0; j < values.length; j++){
            const card  = {}
            card.color  = colors[i]
            card.value  = values[j]
            card.number = Number(values[j]) || Map[values[j]]
            cards.push(card)
        }
    }
    return cards
}

const get5Cards = (cards) => {
    const temp =[]
    for(let i=0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length)
        const randomValue = cards.splice(randomIndex,1)
        temp.push(...randomValue)
    }
    return temp
}

const calCardsInfo = (cards) => {
    const numbers = cards.map(card => card.number)
    const counter = {}
    numbers.forEach(number => counter[number]? counter[number]++ : counter[number]=1)
    const rounds = Object.values(counter).sort((a,b)=>b-a).toString()
    cards.sort((a,b) => {
        if(counter[a.number] == counter[b.number]){
            return b.number-a.number
        }else{
            return counter[b.number]-counter[a.number]
        }
    })
    return {
        isSameColor: isSameColor(cards),
        rounds: rounds,
        cards: cards
    }
}

const isSameColor = (cards) => {
    return cards.every(card=>card.color==cards[0].color)
}

function calCardRank(info){
    const { isSameColor, cards, rounds } = info
    if(isSameColor) {
        if(cards[0].number - cards[4].number == 4) {
            if(cards[0].number == 14) {
                return 10
            }else{
                return 9
            }
        }else{
            return 6
        }
    }else{
        if(rounds === '2,1,1,1') {
            return 2
        }
        if(rounds === '2,2,1') {
            return 3
        }
        if(rounds === '3,1,1') {
            return 4
        }
        if(rounds === '3,2') {
            return 7
        }
        if(rounds === '4,1') {
            return 8
        }
        if(rounds === '1,1,1,1,1'){
            if(cards[0].number - cards[4].number == 4) {
                return 5
            }else{
                return 1
            }
        }
    }
}

const compareCardSize = (players) => {
    const ranks = players.map(player => ({
        name: player.name,
        rank: calCardRank(player.cards),
        cards: player.cards.cards,  // 新增，显示每位玩家的牌
    }));

    // 根据排名进行排序
    const sortedPlayers = ranks.sort((a, b) => b.rank - a.rank);

    // 显示每个玩家的牌型
    sortedPlayers.forEach((playerInfo, index) => {
        console.log(`${index + 1} 的牌型为: ${Map[playerInfo.rank]} (${playerInfo.cards.map(c => c.color + c.value).join(', ')})`);
    });

    const winner = sortedPlayers[0];
    console.log(`${winner.name} 赢了`);

    // 检查是否有牌型相同的玩家，并逐张比较
    if (sortedPlayers.some((player, i, arr) => player.rank === arr[0].rank)) {
        console.log('部分玩家的牌型相同，开始逐张比较');
        const highestRankPlayers = sortedPlayers.filter(player => player.rank === sortedPlayers[0].rank);

        const cardsLength = highestRankPlayers[0].cards.length;

        for (let i = 0; i < cardsLength; i++) {
            console.log(`第${i + 1}轮PK`);
            highestRankPlayers.forEach(player => {
                console.log(`${player.name} 的第${i + 1}张牌: ${player.cards[i].color} ${player.cards[i].value}`);
            });

            let roundWinner = null;
            for (let j = 0; j < highestRankPlayers.length - 1; j++) {
                if (highestRankPlayers[j].cards[i].number < highestRankPlayers[j + 1].cards[i].number) {
                    roundWinner = highestRankPlayers[j + 1].name;
                    break;
                } else if (highestRankPlayers[j].cards[i].number > highestRankPlayers[j + 1].cards[i].number) {
                    roundWinner = highestRankPlayers[j].name;
                    break;
                }
            }

            if (roundWinner) {
                console.log(`${roundWinner} 在本轮获胜`);
                break;
            } else {
                console.log('本轮平局');
            }
        }
    }
};


export {
    generate52Cards,
    get5Cards,
    calCardsInfo,
    calCardRank,
    compareCardSize,
}
