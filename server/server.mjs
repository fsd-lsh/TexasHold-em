
import {generate52Cards, get5Cards, calCardsInfo, compareCardSize} from "./common.mjs"


let playerNumber = 4

// Generate 52 cards
const cards = generate52Cards()

// Hand distribution
let playersPoker = []
for (let i = 0; i < playerNumber; i++) {
    playersPoker.push(
        calCardsInfo(get5Cards(cards))
    )
}

// Rank calculation
compareCardSize(playersPoker)
