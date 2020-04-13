'use strict'

import { rankBoard, rankDescription, evaluateCards } from './phe.js'
//import { rankDescription } from './lib/hand-rank.js'

const board = 'As Ks 4h Ad Kd'
const rank = rankBoard(board)
const name = rankDescription[rank]

const cards = [ 'Ah', 'Kh', 'Qh', 'Jh', 'Th' ]
console.log('%s is a %s', board, name)
console.log(evaluateCards(cards))
