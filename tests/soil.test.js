const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb');
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('soil -> recommendation', () => {
  it('signup login create farm post soil', async () => {
    const email = `test+${Date.now()}@example.com`;
    await request(app).post('/api/v1/auth/signup').send({ name: 'T', email, password: 'Pass123!' }).expect(201);
    const login = await request(app).post('/api/v1/auth/login').send({ email, password: 'Pass123!' }).expect(200);
    const token = login.body.accessToken;
    const farm = await request(app).post('/api/v1/farms').set('Authorization', `Bearer ${token}`).send({ name: 'MyFarm' }).expect(201);
    const farmId = farm.body._id;
    const soilRes = await request(app).post(`/api/v1/soil/${farmId}`).set('Authorization', `Bearer ${token}`)
      .send({ pH: 5.0, moisture: 18 }).expect(201);
    expect(soilRes.body.recommendation).toBeDefined();
  }, 20000);
});
