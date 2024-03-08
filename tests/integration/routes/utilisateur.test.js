const request = require('supertest')
const app = require('../../../src/app')
describe('Get Endpoints', () => {
  it('should return users', async () => {
    const res = await request(app)
      .get('/user')
    expect(res.statusCode).toEqual(200)
    res.body.forEach((user) => {
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('hash_password');
      expect(user).toHaveProperty('is_confirmed');
    });
  })
})