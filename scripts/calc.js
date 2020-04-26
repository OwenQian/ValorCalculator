import {evaluateCards} from './phe.js'

export class PokerCard {
    constructor(rank, suit) {
        if (typeof rank === "string") {
            this.rank = PokerCard.rankMap[rank];
        } else {
            this.rank = rank;
        }
        this.suit = suit;
    }
    static sortDescending(c1, c2) {
        return c2.rank-c1.rank;
    }

    static rankMap = {
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

    static reverseRankMap = {
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
        if (this.rank == PokerCard.rankMap["A"]) {
            return [PokerCard.rankMap["K"], PokerCard.rankMap["2"]];
        } else {
            return [PokerCard.rankMap[PokerCard.reverseRankMap[this.rank]+1]];
        }
    }

    nextStraightCards() {
        if (this.rank == PokerCard.rankMap["A"]) {
            // Straights with an Ace are AKQJT and A5432
            return [PokerCard.rankMap["K"], PokerCard.rankMap["5"]];
        } else if (this.rank == PokerCard.rankMap["2"]) {
            return [];
        } else {
            return [PokerCard.rankMap[PokerCard.reverseRankMap[this.rank-1]]];
        }
    }

    toString() {
        return PokerCard.reverseRankMap[this.rank] + this.suit;
    }

    prettyPrint() {
        console.log(PokerCard.reverseRankMap[this.rank] + this.suit);
    }

    static parseString(s) {
        let handStrs = s.split(" ").map(x => x.trim()).filter(x => x.length > 0);
        let hands = [];
        for (let handStr of handStrs) {
            hands.push(new PokerCard(handStr[0], handStr[1]));
        }
        return hands;
    }
}

export class Deck {
    constructor(deadCards = []) {
        this.deck = [];
        let rankRange = Object.values(PokerCard.rankMap);
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

    generateRunoutSequence(board) {
        let runoutSequence = [];
        if (board.length == 3) {
            for (let i = 0; i < this.deck.length; i++) {
                for (let j = i+1; j < this.deck.length; j++) {
                    runoutSequence.push([this.deck[i], this.deck[j]]);
                }
            }
        } else if (board.length == 4) {
            for (let i = 0; i < this.deck.length; i++) {
                runoutSequence.push([this.deck[i]]);
            }
        }
        return runoutSequence;
    }
}

export class Range {
    constructor() {
        this.hands = [];
    }

    static generatePairCombos(handStr) {
        let comboGroups = Range.expandPairs(handStr);
        let hands = [];
        for (let handStr of comboGroups) {
            let rankCh = handStr[0];
            for (let i = 0; i < 4; i++) {
                for (let j = i+1; j < 4; j++) {
                    let suit1 = PokerCard.reverseSuitMap[i];
                    let suit2 = PokerCard.reverseSuitMap[j];
                    hands.push([new PokerCard(rankCh, suit1), new PokerCard(rankCh, suit2)]);
                }
            }
        }
        return hands;
    }

    static expandUnpaired(handStr) {
        let rank1 = handStr[0];
        let rank2Start = PokerCard.rankMap[handStr[1]];
        let rank2End = rank2Start+1;
        let suitedCh = handStr[2];
        if (handStr[3] == "+") {
            rank2End = PokerCard.rankMap[rank1];
        } else if (handStr[3] == "-") {
            rank2End = rank2Start+1;
            rank2Start = PokerCard.rankMap[handStr[5]];
            console.log(rank2Start, rank2End);
        }
        let comboGroups = [];
        for (let rank = rank2Start; rank < rank2End; rank++) {
            comboGroups.push(rank1 + PokerCard.reverseRankMap[rank] + suitedCh);
        }
        return comboGroups;
    }

    static generatedSuitedCombos(handStr) {
        let comboGroups = Range.expandUnpaired(handStr);
        let hands = [];
        for (let handStr of comboGroups) {
            let rank1 = handStr[0];
            let rank2 = handStr[1];
            for (let i = 0; i < 4; i++) {
                let suit = PokerCard.reverseSuitMap[i];
                hands.push([new PokerCard(rank1, suit), new PokerCard(rank2, suit)]);
            }
        }
        return hands;
    }

    static generateUnsuitedCombos(handStr) {
        let comboGroups = Range.expandUnpaired(handStr);
        let hands = [];
        for (let handStr of comboGroups) {
            let rank1 = handStr[0];
            let rank2 = handStr[1];
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
        }
        return hands;
    }

    static expandPairs(handStr) {
        let startRank = PokerCard.rankMap[handStr[0]];
        let endRank = startRank;
        if (handStr[2] == "+") {
            endRank = PokerCard.rankMap["A"];
        } else if (handStr[2] == "-") {
            startRank = PokerCard.rankMap[handStr[3]];
            endRank = PokerCard.rankMap[handStr[0]];
        }
        let comboGroups = [];
        for (let rank = startRank; rank < endRank+1; rank++) {
            let rankCh = PokerCard.reverseRankMap[rank];
            comboGroups.push(rankCh + rankCh);
        }
        return comboGroups;
    }

    static parseRange(rangeStr) {
        let handStrs = rangeStr.split(",").map(x => x.trim()).filter(x => x.length > 0);
        let uniqueHands = new Set();
        let hands = [];
        let expandedHandStrs = [];
        for (let handStr of handStrs) {
            let combos;
            if (handStr[0] == handStr[1]) {
                expandedHandStrs = expandedHandStrs.concat(Range.expandPairs(handStr));
                combos = Range.generatePairCombos(handStr);
            } else if (handStr[2] == "s") {
                expandedHandStrs = expandedHandStrs.concat(Range.expandUnpaired(handStr));
                combos = Range.generatedSuitedCombos(handStr);
            } else {
                expandedHandStrs = expandedHandStrs.concat(Range.expandUnpaired(handStr));
                combos = Range.generateUnsuitedCombos(handStr);
            }
            combos
                .filter(c => !uniqueHands.has(c.toString()))
                .forEach(c => {
                    hands.push(c)
                    uniqueHands.add(c.toString());
                });
        }
        return [hands, expandedHandStrs.join(", ")];
    }
}

//console.log(Range.generatePairCombos("TT+"));
//console.log(Range.generatedSuitedCombos("KTs+"));
//console.log(Range.generateUnsuitedCombos("KQo"));
//console.log(Range.parseRange("QQ+, 77-44, A9s-A6s, K6s-K2s, T2s+, 76s, AJo+, A6o-A3o, K8o-K7o, Q6o-Q2o"));

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

function filterBlockedHands(vHand, removedCards) {
    for (let c of removedCards) {
        if (vHand[0].toString() == c.toString() || vHand[1].toString() == c.toString()) {
            return false;
        }
    }
    return true;
}

export function calcEquityVsRange(hand, range, flop) {
    return calcAverageRunoutHandStrength(hand, range, flop, (x) => x);
}

export function calcValorVsRange(hand, range, flop) {
    return Math.sqrt(calcAverageRunoutHandStrength(hand, range, flop, (x) => Math.pow(x, 2)));
}

// calcAverageRunoutHandStrength iterates over all 1081 possible turn+river runouts
// then calculates the percentile of our hand vs range on that runout. Finally the
// riverAggregateFunc is applied. The identity function will result in an equity
// calculation and the square function will result in a valor calculation.
// See calcValorVsRange and calcEquityVsRange for more details.
function calcAverageRunoutHandStrength(hand, range, board, riverPercentileFunc) {
    range = range.filter(h => filterBlockedHands(h, [board, hand].flat()));
    let valorSum = 0;
    let excludedCards = [hand, board].flat();
    let deck = new Deck(excludedCards);
    let runoutSequence = deck.generateRunoutSequence(board);
    let numRunoutsCounted = 0;
    for (let runout of runoutSequence) {
        let runoutRange = range.filter(hand => filterBlockedHands(hand, runout));
        // skip runout if the range is empty
        if (runoutRange.length == 0) {
            continue;
        }
        let runoutWeight = runoutRange.length/range.length;
        numRunoutsCounted += runoutWeight;

        let finalBoard = [board, runout].flat();
        let numP1Wins = 0;
        for (let vHand of runoutRange) {
            let outcome = evaluateOutcomeReturnFinalHands(hand, vHand, finalBoard);
            if (outcome[0] > 0) {
                numP1Wins += 1;
            } else if (outcome[0] == 0) {
                numP1Wins += 0.5;
            }
        }

        let equityVsRangeOnRunout = numP1Wins/runoutRange.length;
        valorSum += riverPercentileFunc(equityVsRangeOnRunout)*runoutWeight;
    }
    return valorSum/numRunoutsCounted;
}

export function testCalcValorVsRange() {
    let hand = [new PokerCard(PokerCard.rankMap["9"], "d"), new PokerCard(PokerCard.rankMap["9"], "h")];
    let range = [
        //[new PokerCard(PokerCard.rankMap["Q"], "d"), new PokerCard(PokerCard.rankMap["Q"], "c")],
        //[new PokerCard(PokerCard.rankMap["2"], "c"), new PokerCard(PokerCard.rankMap["2"], "h")],
        [new PokerCard(PokerCard.rankMap["A"], "s"), new PokerCard(PokerCard.rankMap["K"], "c")],
        [new PokerCard(PokerCard.rankMap["A"], "h"), new PokerCard(PokerCard.rankMap["K"], "c")],
    ]
    let board = [
        new PokerCard(PokerCard.rankMap["2"], "d"),
        new PokerCard(PokerCard.rankMap["7"], "d"),
        new PokerCard(PokerCard.rankMap["9"], "c")
    ];
    return calcValorVsRange(hand, range, board);
}
