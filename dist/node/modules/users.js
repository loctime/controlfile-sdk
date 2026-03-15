import { NotFoundError } from '../errors.js';
const USERS_BASE_PATH = '/api/users';
export class UsersModule {
    constructor(http) {
        this.http = http;
    }
    async getProfile() {
        return this.http.call(`${USERS_BASE_PATH}/profile`, { method: 'GET' });
    }
    async updateProfile(body) {
        return this.http.call(`${USERS_BASE_PATH}/profile`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }
    async initialize() {
        return this.http.call(`${USERS_BASE_PATH}/initialize`, {
            method: 'POST',
        });
    }
    async getSettings() {
        return this.callUsersRoute('/settings', { method: 'GET' }, '/api/user/settings');
    }
    async updateSettings(input) {
        return this.callUsersRoute('/settings', {
            method: 'POST',
            body: JSON.stringify(input),
        }, '/api/user/settings');
    }
    async getTaskbar() {
        return this.callUsersRoute('/taskbar', { method: 'GET' }, '/api/user/taskbar');
    }
    async updateTaskbar(items) {
        return this.callUsersRoute('/taskbar', {
            method: 'POST',
            body: JSON.stringify({ items }),
        }, '/api/user/taskbar');
    }
    async callUsersRoute(path, init, legacyPath) {
        try {
            return await this.http.call(`${USERS_BASE_PATH}${path}`, init);
        }
        catch (error) {
            if (legacyPath && error instanceof NotFoundError) {
                return this.http.call(legacyPath, init);
            }
            throw error;
        }
    }
}
