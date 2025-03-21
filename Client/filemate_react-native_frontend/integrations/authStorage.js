import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { postData } from './ServerAPI';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Store authentication tokens and user details.
 */
export const storeAuthData = async (token, refreshToken, user) => {
    try {
        console.log("Raw Token:", token);
        console.log("Refresh Token:", refreshToken);
        console.log("User Data Before Storing:", user);

        if (!user) {
            console.error("No user data received!");
            return;
        }

        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const expiryTimestamp = decodedToken.exp * 1000;
        await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTimestamp.toString());

        console.log("Auth data stored successfully.");
        scheduleTokenRefresh(expiryTimestamp);
    } catch (error) {
        console.error("Error storing auth data:", error);
    }
};

/**
 * Retrieve the stored access token.
 */
export const getToken = async () => {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Retrieve the refresh token.
 */
export const getRefreshToken = async () => {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Retrieve the stored user.
 */
export const getUser = async () => {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

/**
 * Remove authentication data (logout).
 */
export const removeAuthData = async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Refresh the access token using the refresh token.
 */
export const refreshToken = async () => {
    const refresh = await getRefreshToken();

    if (!refresh) {
        console.error("No refresh token available.");
        return null;
    }

    try {
        const response = await postData('/auth/token/refresh/', { refresh });

        if (response?.access) {
            console.log("Token refreshed successfully!");
            await storeAuthData(response.access, response.refresh, await getUser());
            return response.access;
        } else {
            console.error("Failed to refresh token:", response);
            await removeAuthData();  // Logout user if refresh fails
            return null;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        await removeAuthData();
        return null;
    }
};

/**
 * Schedule token refresh before expiration.
 */
export const scheduleTokenRefresh = async (expiryTimestamp) => {
    const now = Date.now();
    const refreshTime = expiryTimestamp - now - 60000; // Refresh 1 minute before expiry

    if (refreshTime > 0) {
        console.log(` Scheduled token refresh in ${refreshTime / 1000}s`);
        setTimeout(async () => {
            await refreshToken();
        }, refreshTime);
    } else {
        console.warn("Token already expired, refreshing now...");
        await refreshToken();
    }
};