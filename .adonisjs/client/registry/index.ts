/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/v1/auth/login',
    tokens: [{"old":"/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/v1/auth/signup',
    tokens: [{"old":"/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/v1/auth/logout',
    tokens: [{"old":"/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'purchases.store': {
    methods: ["POST"],
    pattern: '/v1/purchases/purchase',
    tokens: [{"old":"/v1/purchases/purchase","type":0,"val":"v1","end":""},{"old":"/v1/purchases/purchase","type":0,"val":"purchases","end":""},{"old":"/v1/purchases/purchase","type":0,"val":"purchase","end":""}],
    types: placeholder as Registry['purchases.store']['types'],
  },
  'transactions.index': {
    methods: ["GET","HEAD"],
    pattern: '/v1/transactions',
    tokens: [{"old":"/v1/transactions","type":0,"val":"v1","end":""},{"old":"/v1/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transactions.index']['types'],
  },
  'transactions.show': {
    methods: ["GET","HEAD"],
    pattern: '/v1/transactions/:id',
    tokens: [{"old":"/v1/transactions/:id","type":0,"val":"v1","end":""},{"old":"/v1/transactions/:id","type":0,"val":"transactions","end":""},{"old":"/v1/transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transactions.show']['types'],
  },
  'transactions.refund': {
    methods: ["POST"],
    pattern: '/v1/transactions/:id/refund',
    tokens: [{"old":"/v1/transactions/:id/refund","type":0,"val":"v1","end":""},{"old":"/v1/transactions/:id/refund","type":0,"val":"transactions","end":""},{"old":"/v1/transactions/:id/refund","type":1,"val":"id","end":""},{"old":"/v1/transactions/:id/refund","type":0,"val":"refund","end":""}],
    types: placeholder as Registry['transactions.refund']['types'],
  },
  'clients.index': {
    methods: ["GET","HEAD"],
    pattern: '/v1/clients',
    tokens: [{"old":"/v1/clients","type":0,"val":"v1","end":""},{"old":"/v1/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['clients.index']['types'],
  },
  'clients.show': {
    methods: ["GET","HEAD"],
    pattern: '/v1/clients/:id',
    tokens: [{"old":"/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.show']['types'],
  },
  'products.index': {
    methods: ["GET","HEAD"],
    pattern: '/v1/products',
    tokens: [{"old":"/v1/products","type":0,"val":"v1","end":""},{"old":"/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.index']['types'],
  },
  'products.show': {
    methods: ["GET","HEAD"],
    pattern: '/v1/products/:id',
    tokens: [{"old":"/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/v1/products/:id","type":0,"val":"products","end":""},{"old":"/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.show']['types'],
  },
  'products.store': {
    methods: ["POST"],
    pattern: '/v1/products',
    tokens: [{"old":"/v1/products","type":0,"val":"v1","end":""},{"old":"/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.update': {
    methods: ["PUT"],
    pattern: '/v1/products/:id',
    tokens: [{"old":"/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/v1/products/:id","type":0,"val":"products","end":""},{"old":"/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update']['types'],
  },
  'products.destroy': {
    methods: ["DELETE"],
    pattern: '/v1/products/:id',
    tokens: [{"old":"/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/v1/products/:id","type":0,"val":"products","end":""},{"old":"/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.destroy']['types'],
  },
  'gateways.index': {
    methods: ["GET","HEAD"],
    pattern: '/v1/gateways',
    tokens: [{"old":"/v1/gateways","type":0,"val":"v1","end":""},{"old":"/v1/gateways","type":0,"val":"gateways","end":""}],
    types: placeholder as Registry['gateways.index']['types'],
  },
  'gateways.toggle': {
    methods: ["PATCH"],
    pattern: '/v1/gateways/:id/toggle',
    tokens: [{"old":"/v1/gateways/:id/toggle","type":0,"val":"v1","end":""},{"old":"/v1/gateways/:id/toggle","type":0,"val":"gateways","end":""},{"old":"/v1/gateways/:id/toggle","type":1,"val":"id","end":""},{"old":"/v1/gateways/:id/toggle","type":0,"val":"toggle","end":""}],
    types: placeholder as Registry['gateways.toggle']['types'],
  },
  'gateways.update_priority': {
    methods: ["PATCH"],
    pattern: '/v1/gateways/:id/priority',
    tokens: [{"old":"/v1/gateways/:id/priority","type":0,"val":"v1","end":""},{"old":"/v1/gateways/:id/priority","type":0,"val":"gateways","end":""},{"old":"/v1/gateways/:id/priority","type":1,"val":"id","end":""},{"old":"/v1/gateways/:id/priority","type":0,"val":"priority","end":""}],
    types: placeholder as Registry['gateways.update_priority']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
