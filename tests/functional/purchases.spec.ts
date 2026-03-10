import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import env from '#start/env'
import http from 'node:http'
import User from '#models/user'
import Gateway from '#models/gateway'
import Transaction from '#models/transaction'

test.group('Purchases', (group) => {
  let mockGateway1: http.Server
  let mockGateway2: http.Server
  let authUser: User

  group.each.setup(() => testUtils.db().truncate())

  group.setup(async () => {
    // Start mock servers for the gateways
    mockGateway1 = http.createServer((req, res) => {
      if (req.url === '/transactions' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => body += chunk.toString())
        req.on('end', () => {
          const payload = JSON.parse(body)
          if (payload.amount === 9999) { // specific amount to simulate error
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Mocked Gateway 1 Error' }))
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ id: 1001 }))
          }
        })
      } else {
        res.writeHead(404)
        res.end()
      }
    })

    mockGateway2 = http.createServer((req, res) => {
      if (req.url === '/transactions' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => body += chunk.toString())
        req.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ id: 2002 }))
        })
      } else {
        res.writeHead(404)
        res.end()
      }
    })

    // Assign dynamic ports or use the ones from .env
    const url1 = new URL(env.get('GATEWAY_1_URL', 'http://localhost:3001') as string)
    const url2 = new URL(env.get('GATEWAY_2_URL', 'http://localhost:3002') as string)
    
    await new Promise<void>((resolve) => mockGateway1.listen(Number(url1.port), resolve))
    await new Promise<void>((resolve) => mockGateway2.listen(Number(url2.port), resolve))
  })

  group.teardown(async () => {
    await new Promise<void>((resolve) => mockGateway1.close(() => resolve()))
    await new Promise<void>((resolve) => mockGateway2.close(() => resolve()))
  })

  group.each.setup(async () => {
    // Generate auth user for routes that might need auth
    // Purchases is public in routes.ts! Route: router.post("purchase", [controllers.Purchases, "store"]).prefix("v1")
    // Let's seed the gateways so PaymentProcessor works
    await Gateway.createMany([
      { name: 'gateway_1', priority: 1, isActive: true },
      { name: 'gateway_2', priority: 2, isActive: true },
    ])
  })

  test('successfully process a purchase via gateway 1', async ({ client, assert }) => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      amount: 100,
      cardNumber: '1111222233334444',
      cvv: '123'
    }

    const response = await client.post('/v1/purchase').json(payload)

    response.assertStatus(200)
    assert.equal(response.body().message, 'Pagamento realizado com sucesso')
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.status, 'paid')
    assert.equal(response.body().data.cardLastNumbers, '4444')

    const transaction = await Transaction.find(response.body().data.id)
    assert.isNotNull(transaction)
    assert.equal(transaction?.status, 'paid')
    assert.equal(transaction?.externalId, '1001') // from mock
  })

  test('fallback to gateway 2 if gateway 1 fails', async ({ client, assert }) => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      amount: 9999, // triggers mock error on gateway 1
      cardNumber: '1111222233334444',
      cvv: '123'
    }

    const response = await client.post('/v1/purchase').json(payload)

    response.assertStatus(200)
    assert.equal(response.body().message, 'Pagamento realizado com sucesso')
    assert.equal(response.body().data.status, 'paid')

    const transaction = await Transaction.find(response.body().data.id)
    assert.isNotNull(transaction)
    assert.equal(transaction?.status, 'paid')
    assert.equal(transaction?.externalId, '2002') // from gateway 2
  })

  test('return bad request if all gateways fail', async ({ client, assert }) => {
    // Turn off gateway 2 to simulate total failure
    await Gateway.query().where('name', 'gateway_2').update({ isActive: false })

    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      amount: 9999, // triggers mock error on gateway 1
      cardNumber: '1111222233334444',
      cvv: '123'
    }

    const response = await client.post('/v1/purchase').json(payload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'Não foi possível processar o pagamento')
    assert.equal(response.body().data.status, 'failed')

    const transaction = await Transaction.find(response.body().data.id)
    assert.equal(transaction?.status, 'failed')
  })
})
