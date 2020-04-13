import {evaluateCards} from './phe.js'

export class PokerCard {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    static sortDescending(c1, c2) {
        return c2.rank-c1.rank;
    }

    static cardMap = {
        "A": 14,
        "K": 13,
        "Q": 12,
        "J": 11,
        "T": 10,
        "9": 9,
        "8": 8,
        "7": 7,
        "6": 6,
        "5": 5,
        "4": 4,
        "3": 3,
        "2": 2,
    }

    static suitMap = {
        'd': 0,
        'c': 1,
        's': 2,
        'h': 3
    }

    static reverseSuitMap = {
        0:'d',
        1:'c',
        2:'s',
        3:'h'
    }

    static reverseCardMap = {
        14: "A",
        13: "K",
        12: "Q",
        11: "J",
        10: "T",
        9:  "9",
        8:  "8",
        7:  "7",
        6:  "6",
        5:  "5",
        4:  "4",
        3:  "3",
        2:  "2",
    }

    higherCard() {
        if (this.rank == PokerCard.cardMap["A"]) {
            return [PokerCard.cardMap["K"], PokerCard.cardMap["2"]];
        } else {
            return [PokerCard.cardMap[PokerCard.reverseCardMap[this.rank]+1]];
        }
    }

    nextStraightCards() {
        if (this.rank == PokerCard.cardMap["A"]) {
            // Straights with an Ace are AKQJT and A5432
            return [PokerCard.cardMap["K"], PokerCard.cardMap["5"]];
        } else if (this.rank == PokerCard.cardMap["2"]) {
            return [];
        } else {
            return [PokerCard.cardMap[PokerCard.reverseCardMap[this.rank-1]]];
        }
    }

    toString() {
        return PokerCard.reverseCardMap[this.rank] + this.suit;
    }

    prettyPrint() {
        console.log(PokerCard.reverseCardMap[this.rank] + this.suit);
    }
}

export class Deck {
    constructor(deadCards = []) {
        this.deck = [];
        let rankRange = Object.values(PokerCard.cardMap);
        let minRank = Math.min.apply(null, rankRange);
        let maxRank = Math.max.apply(null, rankRange);
        let removedCards = new Set();
        deadCards.forEach(card => {
            removedCards.add(card.toString());
        });
        for (let rank = minRank; rank < maxRank+1; rank++) {
            for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
                let suit = PokerCard.reverseSuitMap[suitIdx];
                let card = new PokerCard(rank, suit);
                if (!removedCards.has(card.toString())) {
                    this.deck.push(card);
                }
            }
        }
    }

    shuffle() {
        //console.log("shuffling");
        // Fisher-Yates shuffle in reverse
        for (let i = 0; i < this.deck.length; i++) {
            let idx = getRandomInt(0, this.deck.length);
            [this.deck[i], this.deck[idx]] = [this.deck[idx], this.deck[i]]
        }
    }

    drawCardWithReplacement() {
        return this.deck[this.deck.length-1];
    }

    drawCardWithoutReplacement() {
        return this.deck.pop();
    }

    pickRandomCardWithReplacement() {
        let idx = getRandomInt(0, this.deck.length);
        return this.deck[idx];
    }

    pickRandomCardWithoutReplacement() {
        let idx = getRandomInt(0, this.deck.length);
        let ret = this.deck[idx];
        this.deck = this.deck.slice(0, idx).concat(this.deck.slice(idx+1));
        return ret;
    }

    prettyPrint() {
        console.log("------------ Printing deck ------------");
        this.deck.forEach(card => card.prettyPrint());
    }
}

export class PokerHand {
    constructor(c1, c2) {
        this.cards = [c1, c2];
    }
}

export class Range {
    constructor() {
        // Range is an array of PokerHands
        this.hands = [];
    }
}

export class HandRank {
    constructor(category, kicker, extraKickers=[]) {
        this.category = category;
        this.kicker = kicker;
        this.extraKickers = extraKickers;
    }

    static category = {
        "high-card" :       1,
        "pair" :            2,
        "two-pair":         3,
        "three-of-a-kind":  4,
        "straight":         5,
        "flush":            6,
        "full-house":       7,
        "quads":            8,
        "straight-flush":   9
    }
    
    static reverseCategory = {
          0: "invalid",
          1: "high-card",
          2: "pair"        ,
          3: "two-pair" ,
          4: "three-of-a-kind",
          5: "straight" ,
          6: "flush"        ,
          7: "full-house" ,
          8: "quads" ,
          9: "straight-flush" ,
    }

    // compare returns >0 if this wins, 0 for a chop and <0 if other hand wins.
    compare(otherHand) {
        if (this.category != otherHand.category) {
            return this.category - otherHand.category;
        }

        let thisKickers = [this.kicker].concat(this.extraKickers);
        let otherKickers = [otherHand.kicker].concat(otherHand.extraKickers);

        for (let i = 0; i < thisKickers.length; i++) {
            if (thisKickers[i] != otherKickers[i]) {
                return thisKickers[i] - otherKickers[i];
            }
        }
        return 0;
    }

    prettyPrint() {
        console.log(HandRank.reverseCategory[this.category], [this.kicker].concat(this.extraKickers));
    }
}

// evaluateOutcome takes in two hands and a board and returns the winner of the hand.
// Returns >0 if h1 wins, 0 for a chop and <0 if h2 wins.
export function evaluateOutcome(h1, h2, board) {
    return evaluateOutcomeReturnFinalHands(h1, h2, board)[0];
}

function evaluateOutcomeReturnFinalHands(h1, h2, board) {
    let cards1 = [h1, board].flat().map(x => x.toString());
    let cards2 = [h2, board].flat().map(x => x.toString());
    let r1 = evaluateCards(cards1);
    let r2 = evaluateCards(cards2);
    return [r2-r1, r1, r2];
    //let c1 = generateCombinations(h1, board);
    //let r1 = determineHandRank(c1);
    //let c2 = generateCombinations(h2, board);
    //let r2 = determineHandRank(c2);
    //return [r1[0].compare(r2[0]), r1, r2];
}

// getRandomInt returns a number within [min, max)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// TODO: be able to make this go on in an inf loop and take a stop command
export function calcValorVsHand(hand, vHand, board) {
    let excludedCards = [hand, vHand, board].flat();
    console.log(excludedCards);
    let p1 = 0;
    let p2 = 0;
    let numTrials = 1000000;
    for (let i = 0; i < numTrials; i++) {
        let deck = new Deck(excludedCards);
        deck.shuffle();
        let turn = deck.pickRandomCardWithoutReplacement();
        let river = deck.pickRandomCardWithoutReplacement();
        let outcome = evaluateOutcomeReturnFinalHands(hand, vHand, board.concat([turn, river]));
        if (outcome[0] > 0) {
            p1 += 1;
        } else if (outcome[0] == 0) {
            p1 += 0.5;
            p2 += 0.5;
        } else {
            p2 += 1;
        }
    }
    console.log(p1, p2, numTrials);
}

function calcEquityVsRangeGivenRunout(hand, range, flop, runout) {
    let p1 = 0;
    let p2 = 0;
    range.forEach((vHand) => {
        let board = [flop, runout].flat();
        let outcome = evaluateOutcomeReturnFinalHands(hand, vHand, board);
        if (outcome[0] > 0) {
            p1 += 1;
        } else if (outcome[0] == 0) {
            p1 += 0.5;
            p2 += 0.5;
        } else {
            p2 += 1;
        }
    });
    return p1/range.length;
}

export function calcValorVsRange(hand, range, flop) {
    let valorSum = 0;
    range.forEach((vHand) => {
        let p1 = 0;
        let p2 = 0;
        let excludedCards = [hand, vHand, flop].flat();
        let runoutSequence = [];
        let deck = new Deck(excludedCards);
        let cnt = 0;
        for (let i = 0; i < deck.deck.length; i++) {
            for (let j = i+1; j < deck.deck.length; j++) {
                runoutSequence.push([deck.deck[i], deck.deck[j]]);
            }
        }
        runoutSequence.forEach((runout) => {
            let board = [flop, runout].flat();
            let outcome = evaluateOutcomeReturnFinalHands(hand, vHand, board);
            if (outcome[0] > 0) {
                p1 += 1;
            } else if (outcome[0] == 0) {
                p1 += 0.5;
                p2 += 0.5;
            } else {
                p2 += 1;
            }
        });
        let equityVsVHand = p1/runoutSequence.length;
        valorSum += Math.pow(equityVsVHand, 2);
    });
    return valorSum/range.length;
}
