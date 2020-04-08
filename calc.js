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

    prettyPrint() {
        console.log(PokerCard.reverseCardMap[this.rank] + this.suit);
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
        console.log(HandRank.reverseCategory[this.category]);
    }
}

// calculateValor

// generateCombinations returns an array of 7C5 = 21 combinations of the hand and board cards.
export function generateCombinations(hand, board) {
    let allcards = hand.concat(board);
    let boardCombinations = [];
    for (let i = 0; i < 7; i++) {
        for (let j = i+1; j < 7; j++) {
            let segment1 = allcards.slice(0, i);
            let segment2 = allcards.slice(i+1, j);
            let segment3 = allcards.slice(j+1);
            let combo = segment1.concat(segment2, segment3);
            boardCombinations.push(combo);
        }
    }
    return boardCombinations;
}

export function quadsCheck(combo) {
    if (combo[0].rank == combo[1].rank) {
        if (combo[0].rank == combo[1].rank && combo[1].rank == combo[2].rank && combo[2].rank == combo[3].rank) {
            return new HandRank(HandRank.category["quads"], combo[0].rank, [combo[4].rank]);
        }
    } else {
        if (combo[4].rank == combo[1].rank && combo[1].rank == combo[2].rank && combo[2].rank == combo[3].rank) {
            return new HandRank(HandRank.category["quads"], combo[1].rank, [combo[0].rank]);
        }
    }
    return new HandRank(0, 0);
}

export function fullHouseCheck(combo) {
    let tripsRank;
    let pairRank;
    // if the 2nd and 3rd cards match then the first 3 cards must form the trips
    if (combo[1].rank == combo[2].rank) {
        if (!(combo[0].rank == combo[1].rank && combo[1].rank == combo[2].rank)) {
            return new HandRank(0, 0);
        }
        if (combo[3].rank != combo[4].rank) {
            return new HandRank(0, 0);
        }
        tripRank = combo[0].rank;
        pairRank = combo[3].rank;
    } else { // the last 3 cards must form the trips
        if (!(combo[2].rank == combo[3].rank && combo[3].rank == combo[4].rank)) {
            return new HandRank(0, 0);
        }
        if (combo[0].rank != combo[1].rank) {
            return new HandRank(0, 0);
        }
        tripRank = combo[2].rank;
        pairRank = combo[0].rank;
    }
    return new HandRank(HandRank.category["full-house"], tripRank, [pairRank]);
}

export function flushCheck(combo) {
    for (let i = 0; i < combo.length-1; i++) {
        if (combo[i].suit != combo[i+1].suit) {
            return new HandRank(0, 0);
        }
    }
    return new HandRank(HandRank.category["flush"], combo[0].rank, combo.slice(1));
}

export function straightCheck(combo) {
    for (let i = 0; i < combo.length-1; i++) {
        if (!combo[i].nextStraightCards().includes(combo[i+1].rank)) {
            return new HandRank(0, 0);
        }
    }
    return new HandRank(HandRank.category["straight"], combo[0].rank, combo.slice(1).map(x => x.rank));
}

export function straightFlushCheck(combo) {
    let fHandRank = flushCheck(combo);
    if (fHandRank.category == 0) {
        return new HandRank(0, 0);
    } else if (straightCheck(combo).category == 0) {
        return new HandRank(0, 0);
    }
    return new HandRank(HandRank.category["straight-flush"], fHandRank.kicker, fHandRank.extraKickers);
}

export function threeOfAKindCheck(combo) {
    for (let i = 0; i < combo.length-2; i++) {
        if (combo[i].rank == combo[i+1].rank && combo[i+1].rank == combo[i+2].rank) {
            return new HandRank(HandRank.category["three-of-a-kind"], combo[i].rank, combo.slice(0,i).concat(combo.slice(i+3)));
        }
    }
    return new HandRank(0, 0);
}

export function twoPairCheck(combo) {
    let p1, p2;
    let kicker;
    if (combo[0].rank == combo[1].rank && combo[2].rank == combo[3].rank) {
        p1 = combo[0].rank;
        p2 = combo[2].rank;
        kicker = combo[4].rank;
    } else if (combo[0].rank == combo[1].rank && combo[3].rank == combo[4].rank) {
        p1 = combo[0].rank;
        p2 = combo[3].rank;
        kicker = combo[2].rank;
    } else if (combo[1].rank == combo[2].rank && combo[3].rank == combo[4].rank) {
        p1 = combo[1].rank;
        p2 = combo[3].rank;
        kicker = combo[0].rank;
    } else {
        return new HandRank(0, 0);
    }
    return new HandRank(HandRank.category["two-pair"], p1, [p2, kicker]);
}

export function pairCheck(combo) {
    for (let i = 0; i < combo.length-1; i++) {
        if (combo[i].rank == combo[i+1].rank) {
            return new HandRank(HandRank.category["pair"], combo[i].rank, combo.slice(0, i).concat(combo.slice(i+2)));
        }
    }
    return new HandRank(0, 0);
}

export function determineHandRank(boardCombos) {
    // these checks are going to be done from strongest to weakest, so at the lowest ranks, we can assume that there are no stronger classifications.

    let bestHand = new HandRank(0, 0);
    let winningCombo;
    for (let i = 0; i < boardCombos.length; i++) {
        let combo = boardCombos[i];
        let result;
        combo.sort(PokerCard.sortDescending);
        if ((result = straightFlushCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        }
        else if ((result = quadsCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        }
        else if ((result = fullHouseCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        }
        else if ((result = flushCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        }
        else if ((result = straightCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        } else if ((result = threeOfAKindCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        } else if ((result = twoPairCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        } else if ((result = pairCheck(combo)).category != 0) {
            if (bestHand.compare(result) < 0) {
                bestHand = result;
                winningCombo = combo;
            }
        } else {
            let highCardHand = new HandRank(HandRank.category["high-card"], combo[0], combo.slice(1));
            if (bestHand.compare(highCardHand) < 0) {
                bestHand = highCardHand;
                winningCombo = combo;
            }
        }
    }

    return [bestHand, winningCombo];
}

// evaluateOutcome takes in two hands and a board and returns the winner of the hand.
// Returns 1 if h1 wins, 0 for a chop and -1 if h2 wins.
export function evaluateOutcome(h1, h2, board) {
    let c1 = generateCombinations(h1, board);
    let r1 = determineHandRank(c1);
    let c2 = generateCombinations(h2, board);
    let r2 = determineHandRank(c2);
    return r1[0].compare(r2[0]);
}

// getRandomInt returns a number within [min, max)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// TODO: be able to make this go on in an inf loop and take a stop command
function calcValorVsHand(hand, vHand, board) {
    for (let i = 0; i< 1000000
    getRandomInt();
}

function calcValorVsRange(hand, range, board) {
    range.forEach((vHand) => {

    });
}
