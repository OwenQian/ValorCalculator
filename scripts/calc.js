import {evaluateCards} from './phe.js'

export class PokerCard {
    constructor(rank, suit) {
        if (typeof rank === "string") {
            this.rank = PokerCard.cardMap[rank];
        } else {
            this.rank = rank;
        }
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

export class Range {
    constructor() {
        this.hands = [];
    }

    static expandPair(handStr) {
        let rankStr = handStr[0];
        let hands = [];
        for (let i = 0; i < 4; i++) {
            for (let j = i+1; j < 4; j++) {
                let suit1 = PokerCard.reverseSuitMap[i];
                let suit2 = PokerCard.reverseSuitMap[j];
                let card1 = rankStr + suit1;
                let card2 = rankStr + suit2;
                hands.push([new PokerCard(rankStr, suit1), new PokerCard(rankStr, suit2)]);
            }
        }
        return hands;
    }

    static expandSuited(handStr) {
        let rank1 = handStr[0];
        let rank2 = handStr[1];
        let hands = [];
        for (let i = 0; i < 4; i++) {
            let suit = PokerCard.reverseSuitMap[i];
            hands.push([new PokerCard(rank1, suit), new PokerCard(rank2, suit)]);
        }
        return hands;
    }

    static expandUnsuited(handStr) {
        let rank1 = handStr[0];
        let rank2 = handStr[1];
        let hands = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i == j) {
                    continue;
                }
                let suit1 = PokerCard.reverseSuitMap[i];
                let suit2 = PokerCard.reverseSuitMap[j];
                hands.push([new PokerCard(rank1, suit1), new PokerCard(rank2, suit2)]);
            }
        }
        return hands;
    }

    parsePairs() {
        let highPair;
        let lowPair;
        let high = PokerCard.cardMap[highPair];
        let low = PokerCard.cardMap[lowPair];
        for (let rank = low; rank < high+1; rank++) {
            expandPair(PokerCard.reverseCardMap[rank]);
        }
    }

    static parseRange(rangeStr) {
        let handStrs = rangeStr.split(",").map(x => x.trim());
        let hands = [];
        for (let handStr of handStrs) {
            if (handStr[0] == handStr[1]) {
                let pairs = Range.expandPair(handStr);
                hands = hands.concat(pairs);
            } else if (handStr[2] == "s") {
                let suited = Range.expandSuited(handStr);
                hands = hands.concat(suited);
            } else {
                let unsuited = Range.expandUnsuited(handStr);
                hands = hands.concat(unsuited);
            }
        }
        return hands;
    }
}

//console.log(Range.expandPair("TT"));
//console.log(Range.expandSuited("76s"));
//console.log(Range.expandUnsuited("76o"));
//console.log(Range.parseRange("TT, 76s, 76o"));

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

// TODO: account for range blocker effects and calculate a more accurate runout
// probability distribution. Currently this is assuming a uniform distribution.
export function calcValorVsRange(hand, range, flop) {
    let valorSum = 0;
    let runoutSequence = [];
    let excludedCards = [hand, flop].flat();
    let deck = new Deck(excludedCards);
    for (let i = 0; i < deck.deck.length; i++) {
        for (let j = i+1; j < deck.deck.length; j++) {
            runoutSequence.push([deck.deck[i], deck.deck[j]]);
        }
    }
    let numRunoutsCounted = 0;
    // TODO: calculating the probability distribution when given a wide range
    // might be expensive, but when the range is wide, the blocker effects are
    // less impactful. Perhaps a heuristic to only calculate the dist if the
    // width of the range is under 100. Or more precisely if the relative frequency
    // of a card in the range is < 10%.
    for (let runout of runoutSequence) {
        let runoutCounted = false;
        let numP1Wins = 0;
        let cnt = 0;
        let numVHandsSkipped = 0;
        let numVHandsProcessed = 0;
        rangeLoop:
        for (let vHand of range) {
            // check for card removal and skip hand if it's been blocked
            for (let c of runout) {
                if (vHand[0].toString() == c.toString() || vHand[1].toString() == c.toString()) {
                    numVHandsSkipped += 1;
                    continue rangeLoop;
                }
            }
            runoutCounted = true;
            numVHandsProcessed += 1;
            let board = [flop, runout].flat();
            let outcome = evaluateOutcomeReturnFinalHands(hand, vHand, board);
            if (outcome[0] > 0) {
                numP1Wins += 1;
            } else if (outcome[0] == 0) {
                numP1Wins += 0.5;
            } else {
            }
        }

        if (runoutCounted) {
            numRunoutsCounted += 1;
        }
        //console.log("---------------------");
        //console.log("runout", runout);
        //console.log("p1", numP1Wins);
        //console.log("num skipped", numVHandsSkipped);
        //console.log("num processed", numVHandsProcessed);
        if (numVHandsProcessed == 0) {
            continue;
        }
        let equityVsRangeOnRunout = numP1Wins/numVHandsProcessed;
        //console.log("equity", equityVsRangeOnRunout);
        valorSum += Math.pow(equityVsRangeOnRunout, 2);
    }
    //console.log("=====================");
    //console.log("valorSum", valorSum);
    //console.log("num runouts", runoutSequence.length);
    //console.log("numRunoutsCounted", numRunoutsCounted);
    return valorSum/numRunoutsCounted;
}

export function testCalcValorVsRange() {
    let hand = [new PokerCard(PokerCard.cardMap["9"], "d"), new PokerCard(PokerCard.cardMap["9"], "h")];
    let range = [
        //[new PokerCard(PokerCard.cardMap["Q"], "d"), new PokerCard(PokerCard.cardMap["Q"], "c")],
        //[new PokerCard(PokerCard.cardMap["2"], "c"), new PokerCard(PokerCard.cardMap["2"], "h")],
        [new PokerCard(PokerCard.cardMap["A"], "s"), new PokerCard(PokerCard.cardMap["K"], "c")],
        [new PokerCard(PokerCard.cardMap["A"], "h"), new PokerCard(PokerCard.cardMap["K"], "c")],
    ]
    let board = [
        new PokerCard(PokerCard.cardMap["2"], "d"),
        new PokerCard(PokerCard.cardMap["7"], "d"),
        new PokerCard(PokerCard.cardMap["9"], "c")
    ];
    return calcValorVsRange(hand, range, board);
}
