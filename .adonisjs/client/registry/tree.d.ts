/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
  }
  purchases: {
    store: typeof routes['purchases.store']
  }
  transactions: {
    index: typeof routes['transactions.index']
    show: typeof routes['transactions.show']
    refund: typeof routes['transactions.refund']
  }
  clients: {
    index: typeof routes['clients.index']
    show: typeof routes['clients.show']
  }
  products: {
    index: typeof routes['products.index']
    show: typeof routes['products.show']
    store: typeof routes['products.store']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  gateways: {
    index: typeof routes['gateways.index']
    toggle: typeof routes['gateways.toggle']
    updatePriority: typeof routes['gateways.update_priority']
  }
}
