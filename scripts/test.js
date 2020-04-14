import {Deck, PokerCard, calcValorVsHand, calcValorVsRange} from './calc.js';
import {determineHandRank, generateCombinations} from './naive-hand-eval.js'

export function testDetermineHandRank() {
    // straight flush
    let board = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["Q"], "d"),
        new PokerCard(PokerCard.cardMap["3"], "s"),
        new PokerCard(PokerCard.cardMap["T"], "c")
    ];
    let hand = [
        new PokerCard(PokerCard.cardMap["J"], "d"),
        new PokerCard(PokerCard.cardMap["T"], "d")
    ];
    let r = determineHandRank(generateCombinations(hand, board));
    r[0].prettyPrint();
    r[1].forEach(x => x.prettyPrint());
}

export function testGenerateCombinations() {
    console.log(generateCombinations([1,2], [3,4,5,6,7]));
}

export function testQuadsCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["A"], "h"),
        new PokerCard(PokerCard.cardMap["A"], "s"),
        new PokerCard(PokerCard.cardMap["K"], "s")
    ];
    console.log("testing A-quads, K kicker", quadsCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "h"),
        new PokerCard(PokerCard.cardMap["K"], "s"),
        new PokerCard(PokerCard.cardMap["A"], "s")
    ];
    console.log("testing K-quads, A kicker", quadsCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["A"], "h"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "s")
    ];
    console.log("testing non-quads", quadsCheck(combo));
}

export function testFullHouseCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["A"], "h"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "s")
    ];
    console.log("testing boat A full of K", fullHouseCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "h"),
        new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "s")
    ];
    console.log("testing boat K full of A", fullHouseCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "h"),
        new PokerCard(PokerCard.cardMap["K"], "s"),
        new PokerCard(PokerCard.cardMap["A"], "s")
    ];
    console.log("testing non-boat", fullHouseCheck(combo));
}

export function testFlushCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["Q"], "d"),
        new PokerCard(PokerCard.cardMap["J"], "d"),
        new PokerCard(PokerCard.cardMap["T"], "d")
    ];
    console.log("diamond flush", flushCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["7"], "c"),
        new PokerCard(PokerCard.cardMap["4"], "c"),
        new PokerCard(PokerCard.cardMap["2"], "c")
    ];
    console.log("club flush", flushCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "s")
    ];
    console.log("testing non-flush", flushCheck(combo));
}

export function testStraightCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["Q"], "d"),
        new PokerCard(PokerCard.cardMap["J"], "d"),
        new PokerCard(PokerCard.cardMap["T"], "d")
    ];
    console.log("broadway straight", straightCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["5"], "c"),
        new PokerCard(PokerCard.cardMap["4"], "c"),
        new PokerCard(PokerCard.cardMap["3"], "c"),
        new PokerCard(PokerCard.cardMap["2"], "c")
    ];
    console.log("wheel straight", straightCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["6"], "c"),
        new PokerCard(PokerCard.cardMap["5"], "c"),
        new PokerCard(PokerCard.cardMap["4"], "c"),
        new PokerCard(PokerCard.cardMap["3"], "c"),
        new PokerCard(PokerCard.cardMap["2"], "c")
    ];
    console.log("non-edge case straight", straightCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["T"], "d"),
        new PokerCard(PokerCard.cardMap["9"], "d"),
        new PokerCard(PokerCard.cardMap["8"], "d"),
        new PokerCard(PokerCard.cardMap["6"], "d"),
        new PokerCard(PokerCard.cardMap["5"], "s")
    ];
    console.log("non straight", straightCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["5"], "d"),
        new PokerCard(PokerCard.cardMap["4"], "d"),
        new PokerCard(PokerCard.cardMap["3"], "d"),
        new PokerCard(PokerCard.cardMap["2"], "d"),
        new PokerCard(PokerCard.cardMap["2"], "s")
    ];
    console.log("non straight ending in 2", straightCheck(combo));
}

export function testStraightFlushCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["Q"], "d"),
        new PokerCard(PokerCard.cardMap["J"], "d"),
        new PokerCard(PokerCard.cardMap["T"], "d")
    ];
    console.log("royal", straightFlushCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["5"], "c"),
        new PokerCard(PokerCard.cardMap["4"], "c"),
        new PokerCard(PokerCard.cardMap["3"], "c"),
        new PokerCard(PokerCard.cardMap["2"], "c")
    ];
    console.log("wheel SF", straightFlushCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["6"], "c"),
        new PokerCard(PokerCard.cardMap["5"], "c"),
        new PokerCard(PokerCard.cardMap["4"], "c"),
        new PokerCard(PokerCard.cardMap["3"], "c"),
        new PokerCard(PokerCard.cardMap["2"], "c")
    ];
    console.log("non-edge case SF", straightFlushCheck(combo));
}

export function testThreeOfAKindCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["T"], "d")
    ];
    console.log("trips start at idx 0", threeOfAKindCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c")
    ];
    console.log("trips start at idx 1", threeOfAKindCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c")
    ];
    console.log("trips start at idx 2", threeOfAKindCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["9"], "c"),
        new PokerCard(PokerCard.cardMap["9"], "c")
    ];
    console.log("non trips", threeOfAKindCheck(combo));
}

export function testTwoPairCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["T"], "d")
    ];
    console.log("kicker at idx 4", twoPairCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c")
    ];
    console.log("kicker at idx 0", twoPairCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c")
    ];
    console.log("kicker at idx 2", twoPairCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["9"], "c")
    ];
    console.log("non 2p", twoPairCheck(combo));
}

export function testPairCheck() {
    combo = [new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["J"], "d"),
        new PokerCard(PokerCard.cardMap["T"], "d")
    ];
    console.log("pair start at idx 0", pairCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["J"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c")
    ];
    console.log("pair start at idx 1", pairCheck(combo));

    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["9"], "c")
    ];
    console.log("pair start at idx 2", pairCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["9"], "c"),
        new PokerCard(PokerCard.cardMap["9"], "c")
    ];
    console.log("pair start at idx 2", pairCheck(combo));
    combo = [new PokerCard(PokerCard.cardMap["A"], "c"),
        new PokerCard(PokerCard.cardMap["K"], "c"),
        new PokerCard(PokerCard.cardMap["T"], "c"),
        new PokerCard(PokerCard.cardMap["9"], "c"),
        new PokerCard(PokerCard.cardMap["7"], "c")
    ];
    console.log("no pair", pairCheck(combo));
}

function testDeckConstructor() {
    let excludedCards = [
        new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["A"], "d"),
        new PokerCard(PokerCard.cardMap["K"], "d"),
        new PokerCard(PokerCard.cardMap["Q"], "s"),
        new PokerCard(PokerCard.cardMap["Q"], "h"),
        new PokerCard(PokerCard.cardMap["Q"], "c"),
        new PokerCard(PokerCard.cardMap["Q"], "d"),
    ];
    let deck = new Deck(excludedCards);
    console.log(deck.deck);
}

function testShuffle() {
    let deck = new Deck();
    deck.shuffle();
    console.log(deck.deck);
}

function testDrawCard() {
    let hand = [new PokerCard(PokerCard.cardMap["A"], "d"), new PokerCard(PokerCard.cardMap["A"], "s")];
    let vhand = [new PokerCard(PokerCard.cardMap["K"], "d"), new PokerCard(PokerCard.cardMap["K"], "s")];
    let board = [
        new PokerCard(PokerCard.cardMap["T"], "c") ,
        new PokerCard(PokerCard.cardMap["9"], "c") ,
        new PokerCard(PokerCard.cardMap["8"], "c") ,
        new PokerCard(PokerCard.cardMap["7"], "c"),
        new PokerCard(PokerCard.cardMap["6"], "c") ,
        new PokerCard(PokerCard.cardMap["5"], "c") ,
        new PokerCard(PokerCard.cardMap["4"], "c") ,
        new PokerCard(PokerCard.cardMap["3"], "c") ,
        new PokerCard(PokerCard.cardMap["2"], "c") ,
        new PokerCard(PokerCard.cardMap["T"], "s") ,
        new PokerCard(PokerCard.cardMap["9"], "s") ,
        new PokerCard(PokerCard.cardMap["8"], "s") ,
        new PokerCard(PokerCard.cardMap["7"], "s") ,
        new PokerCard(PokerCard.cardMap["6"], "s") ,
        new PokerCard(PokerCard.cardMap["5"], "s") ,
        new PokerCard(PokerCard.cardMap["4"], "s") ,
        new PokerCard(PokerCard.cardMap["3"], "s") ,
        new PokerCard(PokerCard.cardMap["2"], "s"),
        new PokerCard(PokerCard.cardMap["T"], "h") ,
        new PokerCard(PokerCard.cardMap["9"], "h") ,
        new PokerCard(PokerCard.cardMap["8"], "h") ,
        new PokerCard(PokerCard.cardMap["7"], "h") ,
        new PokerCard(PokerCard.cardMap["6"], "h") ,
        new PokerCard(PokerCard.cardMap["5"], "h") ,
        new PokerCard(PokerCard.cardMap["4"], "h") ,
        new PokerCard(PokerCard.cardMap["3"], "h") ,
        new PokerCard(PokerCard.cardMap["2"], "h")
    ];
    let deck = new Deck([hand, vhand, board].flat());
    console.log(deck.deck.length);
    let tally = {};
    let numTrials = 100000;
    for (let i = 0; i < numTrials; i++) {
        deck.shuffle();
        let c = deck.drawCardWithReplacement();
        if (!(c.toString() in tally)) {
            tally[c.toString()] = 1;
        } else {
            tally[c.toString()] += 1;
        }
    }
    Object.keys(tally).forEach(k => {
        console.log(k, "appeared", tally[k]/numTrials);
    });
}
//
//function testCalcValorVsHand() {
//    let hand = [new PokerCard(PokerCard.cardMap["A"], "d"), new PokerCard(PokerCard.cardMap["K"], "d")];
//    let vhand = [new PokerCard(PokerCard.cardMap["Q"], "d"), new PokerCard(PokerCard.cardMap["Q"], "c")];
//    let board = [
//        new PokerCard(PokerCard.cardMap["2"], "d"),
//        new PokerCard(PokerCard.cardMap["7"], "d"),
//        new PokerCard(PokerCard.cardMap["T"], "c")
//    ];
//    console.log(calcValorVsHand(hand, vhand, board));
//}

//testCalcValorVsRange();
