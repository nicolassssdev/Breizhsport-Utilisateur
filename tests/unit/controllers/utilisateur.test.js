const Controller = require('../../../src/controllers/utilisateur');
const User = require('../../../src/models/utilisateur');

jest.mock('../../../src/models/utilisateur');

describe('Controller Unit Test Suites', () => {
  it('should return an array of User instances', async () => {
    User.findAll.mockResolvedValue([
      { id: 1, name: 'User1' },
      { id: 2, name: 'User2' },
    ]);

    const req = {};
    const res = {
      status: jest.fn(() => res), 
      json: jest.fn(),
    };

    users = await Controller.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: 'User1' },
      { id: 2, name: 'User2' },
    ]);
  });
});
