import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import env from '#start/env'
import http from 'node:http'
import User from '#models/user'
import Gateway from '#models/gateway'
import Transaction from '#models/transaction'
import Client from '#models/client'

test.group('Transactions', (group) => {
  let mockGateway1: http.Server
  let authUser: User
  let clientInDb: Client
  let gatewayInDb: Gateway

  group.each.setup(() => testUtils.db().truncate())

  group.setup(async () => {
    mockGateway1 = http.createServer((req, res) => {
      if (req.url?.includes('/charge_back') && req.method === 'POST') {
        const id = req.url.split('/')[2]
        if (id === 'err_id') {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Error on refund' }))
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ id, status: 'refunded' }))
        }
      } else {
        res.writeHead(404)
        res.end()
      }
    })

    const url1 = new URL(env.get('GATEWAY_1_URL', 'http://localhost:3001') as string)
    await new Promise<void>((resolve) => mockGateway1.listen(Number(url1.port), resolve))
  })

  group.teardown(async () => {
    await new Promise<void>((resolve) => mockGateway1.close(() => resolve()))
  })

  group.each.setup(async () => {
    // Generate auth user
    authUser = await User.create({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'secretpassword',
    })

    clientInDb = await Client.create({
      name: 'John Client',
      email: 'john.client@example.com'
    })

    gatewayInDb = await Gateway.create({
      name: 'gateway_1',
      priority: 1,
      isActive: true,
    })
  })

  test('list transactions', async ({ client, assert }) => {
    await Transaction.create({
      clientId: clientInDb.id,
      gatewayId: gatewayInDb.id,
      status: 'paid',
      amount: 150.00,
      cardLastNumbers: '1234',
      externalId: 'ext_1',
    })

    const response = await client.get('/v1/transactions').loginAs(authUser)

    response.assertStatus(200)
    const body = response.body() as any
    assert.isArray(body.data)
    assert.lengthOf(body.data, 1)
    assert.equal(body.data[0].amount, 150)
  })

  test('show transaction details', async ({ client, assert }) => {
    const trx = await Transaction.create({
      clientId: clientInDb.id,
      gatewayId: gatewayInDb.id,
      status: 'paid',
      amount: 150.00,
      cardLastNumbers: '1234',
      externalId: 'ext_1',
    })

    const response = await client.get(`/v1/transactions/${trx.id}`).loginAs(authUser)

    response.assertStatus(200)
    const body = response.body() as any
    assert.equal(body.data.id, trx.id)
    assert.equal(body.data.client.id, clientInDb.id)
    assert.equal(body.data.gateway.id, gatewayInDb.id)
  })

  test('refund transaction successfully', async ({ client, assert }) => {
    const trx = await Transaction.create({
      clientId: clientInDb.id,
      gatewayId: gatewayInDb.id,
      status: 'paid',
      amount: 150.00,
      cardLastNumbers: '1234',
      externalId: 'valid_id',
    })

    const response = await client.post(`/v1/transactions/${trx.id}/refund`).loginAs(authUser)

    response.assertStatus(200)
    const body = response.body() as any
    assert.equal(body.message, 'Reembolso realizado com sucesso')
    assert.equal(body.data.status, 'refunded')

    const dbTrx = await Transaction.find(trx.id)
    assert.equal(dbTrx?.status, 'refunded')
  })

  test('refuse refund if not paid', async ({ client, assert }) => {
    const trx = await Transaction.create({
      clientId: clientInDb.id,
      gatewayId: gatewayInDb.id,
      status: 'pending',
      amount: 150.00,
      cardLastNumbers: '1234',
      externalId: 'ext_1',
    })

    const response = await client.post(`/v1/transactions/${trx.id}/refund`).loginAs(authUser)

    response.assertStatus(400)
    const body = response.body() as any
    assert.equal(body.message, 'Somente transações pagas podem ser reembolsadas')
  })

  test('return error from gateway refund', async ({ client, assert }) => {
    const trx = await Transaction.create({
      clientId: clientInDb.id,
      gatewayId: gatewayInDb.id,
      status: 'paid', // must be paid
      amount: 150.00,
      cardLastNumbers: '1234',
      externalId: 'err_id', // mock uses this ID to trigger error
    })

    const response = await client.post(`/v1/transactions/${trx.id}/refund`).loginAs(authUser)

    response.assertStatus(400)
    const body = response.body() as any
    assert.equal(body.message, 'Falha ao realizar reembolso no gateway')
  })
})
