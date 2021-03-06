import 'dexie-observable'
import moment from 'moment'
import VeilDatabase from 'store/db'

let db: any
export default {
  async open(wallet: string, onChanges: Function) {
    db = new VeilDatabase(wallet)
    db.on('changes', onChanges)
    return await db.open()
  },

  async addTransaction(transaction: any) {
    try {
      await db.transactions.put(transaction)
    } catch (e) {
      console.error(e.stack)
    }
  },

  async addTransactions(transactions: any[]) {
    try {
      await db.transactions.bulkPut(transactions)
    } catch (e) {
      console.error(e.stack)
    }
  },

  async listTransactionIds({ category, query }: any = {}) {
    const txs = db.transactions.orderBy('time').reverse()

    if (!category && !query) {
      return await txs.primaryKeys()
    }

    return (await txs.toArray())
      .filter(
        (tx: any) =>
          (!category || tx.category === category) &&
          tx.txid.includes(query) &&
          (tx.category !== 'stake' || tx.confirmations > 25)
      )
      .map((tx: any) => tx.txid)
  },

  async fetchTransactions() {
    return await db.transactions.toArray()
  },

  async fetchTransaction(txid: string) {
    return await db.transactions
      .where('txid')
      .equals(txid)
      .first()
  },

  async fetchFirstTransaction() {
    return await db.transactions.orderBy('time').first()
  },

  async fetchStakesForDay(daysAgo: number) {
    const start = moment()
      .subtract(daysAgo, 'days')
      .startOf('day')
      .valueOf()
    const end = moment()
      .subtract(daysAgo, 'days')
      .endOf('day')
      .valueOf()
    return await db.transactions
      .where('time')
      .between(start, end, true, true)
      .filter((tx: any) => tx.category === 'stake')
      .toArray()
  },

  async fetchStakesForPeriod(daysUntilToday: number) {
    const start = moment()
      .subtract(daysUntilToday, 'days')
      .startOf('day')
      .valueOf()
    const end = moment()
      .endOf('day')
      .valueOf()
    return await db.transactions
      .where('time')
      .between(start, end, true, true)
      .filter((tx: any) => tx.category === 'stake')
      .toArray()
  },

  async clearTransactions() {
    return await db.transactions.clear()
  },
}
