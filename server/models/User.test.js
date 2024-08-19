const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany();
});

describe('User Model Test', () => {
    it('create & save user successfully', async () => {
        const validUser = new User({
            username: "Test Username",
            password: "Test Password"
        });
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe("Test Username");
        expect(savedUser.password).toBe("Test Password");
    })

    it('create user without required field password should fail', async () => {
        const userWithoutRequiredField = new User({ username: "TestUsername" });
        await expect(userWithoutRequiredField.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('create user without required field username should fail', async () => {
        const userWithoutRequiredField = new User({ password: "TestPassword" });
        await expect(userWithoutRequiredField.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('create user with duplicate username should fail', async () => {
        const user1 = new User({ username: "DuplicateUser", password: "TestPassword1" });
        await user1.save();

        const user2 = new User({ username: "DuplicateUser", password: "TestPassword2" });
        await expect(user2.save()).rejects.toThrow(mongoose.Error.MongoError);
    });

    it('create user with empty username or password should fail', async () => {
        const userEmptyUsername = new User({ username: "", password: "TestPassword" });
        await expect(userEmptyUsername.save()).rejects.toThrow(mongoose.Error.ValidationError);

        const userEmptyPassword = new User({ username: "TestUsername", password: "" });
        await expect(userEmptyPassword.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
})