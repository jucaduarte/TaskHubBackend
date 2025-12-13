
const userController = require('../controllers/userController');
const User = require('../models/User');

jest.mock('../models/User');

describe('userController.listUsers', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = { // resposta mockada
            json: jest.fn()
        };
    });


    // Teste: deve retornar a lista de usuários
    it('deve retornar a lista de usuários', async () => {
        const mockUsers = [
            { id: 1, name: 'Juca', email: 'juca@tjin.com' },
            { id: 2, name: 'Rebeca', email: 'rebeca@tjin.com' }
        ];

        User.findAll.mockResolvedValue(mockUsers);

        await userController.listUsers(req, res);

        expect(User.findAll).toHaveBeenCalledWith({
            attributes: ['id', 'name', 'email']
        });

        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });


    // Teste: deve retornar um array vazio quando não houver usuários
    it('deve retornar um array vazio quando não houver usuários', async () => {
        User.findAll.mockResolvedValue([]);

        await userController.listUsers(req, res);

        expect(User.findAll).toHaveBeenCalledWith({
            attributes: ['id', 'name', 'email']
        });

        expect(res.json).toHaveBeenCalledWith([]);
    });
});