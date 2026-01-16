import request from 'supertest';
import app from '../../app';
import i18n from 'i18n';

// Use global storage for token to persist across test files
declare global {
     
    var __AUTH_TOKEN__: string | null;
}

/**
 * Get or create authentication token for integration tests
 * This ensures we only login once and reuse the token across all test suites
 */
export async function getAuthToken(): Promise<string> {
    if (global.__AUTH_TOKEN__) {
        console.log('✓ Reusing existing authentication token');
        return global.__AUTH_TOKEN__;
    }

    // Set locale
    i18n.setLocale('en');

    // Login once and store the token
    const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
            username: process.env.TEST_ADMIN_USERNAME || 'admin@test.com',
            password: process.env.TEST_ADMIN_PASSWORD || '123456',
        });

    if (loginResponse.status === 200 && loginResponse.body.result?.token) {
        global.__AUTH_TOKEN__ = loginResponse.body.result.token;
        console.log(
            '✓ Shared authentication token obtained for integration tests',
        );
        return global.__AUTH_TOKEN__ as string;
    }

    throw new Error(
        `Failed to obtain auth token: ${loginResponse.status} - ${JSON.stringify(loginResponse.body)}`,
    );
}

/**
 * Reset the shared token (useful for testing token expiration scenarios)
 */
export function resetAuthToken(): void {
    global.__AUTH_TOKEN__ = null;
}
