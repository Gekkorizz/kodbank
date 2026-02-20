import request from 'supertest';
import app from '../../src/app'; // Adjust the path to your app entry point
import { UserFactory } from './factories';

export class APITestHelper {
  static async createTestUser(overrides = {}) {
    return UserFactory.create(overrides);
  }

  static async loginUser(email, password) {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    return {
      token: response.body.token,
      user: response.body.user,
    };
  }

  static async makeAuthenticatedRequest(method, url, token, body = {}) {
    return request(app)
      [method](url)
      .set('Authorization', `Bearer ${token}`)
      .send(body);
  }
}