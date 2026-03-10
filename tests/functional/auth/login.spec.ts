import { test } from '@japa/runner'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth login', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('return error when required fields are missing', async ({ client, assert }) => {
    const response = await client.post('/v1/auth/login').json({} as any)

    response.assertStatus(422)
    const body = response.body() as any
    assert.isArray(body.errors)
    const errFields = body.errors.map((e: any) => e.field)
    assert.includeMembers(errFields, ['email', 'password'])
  })

  test('return error when credentials are invalid', async ({ client }) => {
    await User.create({
      email: 'johndoe@example.com',
      password: 'secretpassword'
    })

    const response = await client.post('/v1/auth/login').json({
      email: 'johndoe@example.com',
      password: 'wrongpassword',
    } as any)

    response.assertStatus(400) // VineJS verifyCredentials usually throws 400 Invalid credentials
    // We will dump fatal error if it's 500
    if (response.hasFatalError()) {
      response.dump()
    }
  })

  test('successfully login', async ({ client, assert }) => {
    await User.create({
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      password: 'secretpassword'
    })

    const response = await client.post('/v1/auth/login').json({
      email: 'johndoe@example.com',
      password: 'secretpassword',
    })

    response.assertStatus(200)
    assert.properties(response.body(), ['data'])
    assert.properties(response.body().data, ['user', 'token'])
    assert.equal(response.body().data.user.email, 'johndoe@example.com')
  })

  test('successfully logout', async ({ client }) => {
    await User.create({
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      password: 'secretpassword'
    })

    const loginResponse = await client.post('/v1/auth/login').json({
      email: 'johndoe@example.com',
      password: 'secretpassword',
    })
    const token = loginResponse.body().data.token

    const response = await client.post('/v1/auth/logout').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Logged out successfully'
    })
  })
  
  test('return 401 when trying to logout without token', async ({ client }) => {
    const response = await client.post('/v1/auth/logout')

    response.assertStatus(401)
  })
})
