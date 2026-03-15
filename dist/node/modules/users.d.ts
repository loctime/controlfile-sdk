import type { InitializeUserResponse, SuccessResponse, TaskbarItem, UpdateTaskbarResponse, UpdateUserProfileInput, UpdateUserProfileResponse, UpdateUserSettingsInput, UserProfileResponse, UserSettingsResponse } from '../types.js';
import { HttpClient } from '../utils/http.js';
export declare class UsersModule {
    private http;
    constructor(http: HttpClient);
    getProfile(): Promise<UserProfileResponse>;
    updateProfile(body: UpdateUserProfileInput): Promise<UpdateUserProfileResponse>;
    initialize(): Promise<InitializeUserResponse>;
    getSettings(): Promise<UserSettingsResponse>;
    updateSettings(input: UpdateUserSettingsInput): Promise<SuccessResponse>;
    getTaskbar(): Promise<{
        items: TaskbarItem[];
    }>;
    updateTaskbar(items: TaskbarItem[]): Promise<UpdateTaskbarResponse>;
    private callUsersRoute;
}
