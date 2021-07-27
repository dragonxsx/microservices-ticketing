import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// declare global {
//     namespace NodeJS {
//         interface Global {
//             signin(): string;
//         }
//     }
// }

declare global {
    var signin: (id?: string) => string;
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51JHfUpBA28lmwzEchTJIt7zeUyh1GEVzY9iXTPdsEkzwmCAAId36yPWL4rz7dB9WzF6250rfDUgFKPMGGrq42rWn00aEgwelbN';

let mongo: any;
beforeAll(async() => {
    process.env.JWT_KEY = 'jwt123';
    // jest.setTimeout(120*1000);

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }

    jest.clearAllMocks();
})

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload {id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object. { jwt: MY_JWT }
    const session = {jwt: token};

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return `express:sess=${base64}`;
}