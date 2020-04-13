'use strict'

/* eslint-disable camelcase */
import { suits }         from'./dptables.js'
import { noflush6 }      from'./hashtable6.js'
import { flush }         from'./hashtable.js'
import { hash_quinary }  from'./hash.js'

import { binaries_by_id, suitbit_by_id } from './bin-bit-table.js'

export function evaluate_6_cards(a, b, c, d, e, f) {
  var suit_hash = 0
  const suit_binary = [ 0, 0, 0, 0 ] // 4
  const quinary = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] // 13
  var hash

  suit_hash += suitbit_by_id[a]
  quinary[(a >> 2)]++
  suit_hash += suitbit_by_id[b]
  quinary[(b >> 2)]++
  suit_hash += suitbit_by_id[c]
  quinary[(c >> 2)]++
  suit_hash += suitbit_by_id[d]
  quinary[(d >> 2)]++
  suit_hash += suitbit_by_id[e]
  quinary[(e >> 2)]++
  suit_hash += suitbit_by_id[f]
  quinary[(f >> 2)]++

  if (suits[suit_hash]) {
    suit_binary[a & 0x3] |= binaries_by_id[a]
    suit_binary[b & 0x3] |= binaries_by_id[b]
    suit_binary[c & 0x3] |= binaries_by_id[c]
    suit_binary[d & 0x3] |= binaries_by_id[d]
    suit_binary[e & 0x3] |= binaries_by_id[e]
    suit_binary[f & 0x3] |= binaries_by_id[f]

    return flush[suit_binary[suits[suit_hash] - 1]]
  }

  hash = hash_quinary(quinary, 13, 6)

  return noflush6[hash]
}
