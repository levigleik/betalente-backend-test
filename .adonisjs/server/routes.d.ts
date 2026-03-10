import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'purchases.store': { paramsTuple?: []; params?: {} }
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.refund': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'clients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.index': { paramsTuple?: []; params?: {} }
    'gateways.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.update_priority': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'purchases.store': { paramsTuple?: []; params?: {} }
    'transactions.refund': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'clients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'clients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.index': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'gateways.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.update_priority': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}