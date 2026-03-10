import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Client from '#models/client'

test.group('Clients', (group) => {
  let authUser: User

  group.each.setup(() => testUtils.db().truncate())

  group.each.setup(async () => {
    authUser = await User.create({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'secretpassword',
    })
  })

  test('list clients', async ({ client, assert }) => {
    await Client.createMany([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Doe', email: 'jane@example.com' }
    ])

    const response = await client.get('/v1/clients').loginAs(authUser)

    response.assertStatus(200)
    const body = response.body() as any
    assert.isArray(body.data)
    assert.lengthOf(body.data, 2)
  })

  test('show client details', async ({ client, assert }) => {
    const dbClient = await Client.create({
      name: 'John Doe',
      email: 'john@example.com'
    })

    const response = await client.get(`/v1/clients/${dbClient.id}`).loginAs(authUser)

    response.assertStatus(200)
    const body = response.body() as any
    assert.equal(body.data.id, dbClient.id)
    assert.equal(body.data.email, 'john@example.com')
    // Check eager loaded relationships like transactions
    assert.isArray(body.data.transactions)
  })

  test('return 404 for unknown client id', async ({ client }) => {
    const response = await client.get(`/v1/clients/99999`).loginAs(authUser)

    response.assertStatus(404)
  })

  test('require auth token', async ({ client }) => {
    const response = await client.get(`/v1/clients`)

    response.assertStatus(401)
  })
})
