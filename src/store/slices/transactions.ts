import { Derive, AsyncAction } from 'store'
import { Transaction, WalletTransaction } from '../models/transaction'
import { keyBy } from 'lodash'

type State = {
  index: { [txid: string]: Transaction }
  all: Derive<State, Transaction[]>
  forDisplay: Derive<State, Transaction[]>
  find: Derive<State, (id: string) => Transaction>
  latestBlockHash: Derive<State, string | undefined>
}

type Actions = {
  fetch: AsyncAction<void, Error>
}

export const state: State = {
  index: {},
  all: state => Object.values(state.index),
  forDisplay: state =>
    state.all.filter(tx => tx.isVisible).sort((a, b) => b.time - a.time),
  find: state => id => state.index[id],
  latestBlockHash: state => state.forDisplay[0]?.walletTx?.blockhash,
}

export const actions: Actions = {
  async fetch({ state, effects, actions }) {
    try {
      const transactions: WalletTransaction[] = await effects.rpc
        .listTransactions
        //state.transactions.latestBlockHash
        ()
      state.transactions.index = keyBy(
        transactions.map(tx => new Transaction(tx)),
        'txid'
      )
      return null
    } catch (e) {
      return e
    }
  },
}