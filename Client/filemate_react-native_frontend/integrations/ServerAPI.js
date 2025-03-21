require('dotenv').config();
console.log("dotenv config loaded");

import axios from 'axios';

const PORT = process.env.PORT
const SERVER_URL = `http://localhost:${PORT}/api`;

/**
 * Fetch data (GET request).
 * @param {string} endpoint - API endpoint to fetch data from.
 * @param {object} [headers={}] - Optional headers.
 * @returns {Promise<object>} - The fetched data.
 */
export default async function fetchData(endpoint, headers = {}) {
    console.log("Fetching from:", `${SERVER_URL}${endpoint}`); // Debug log

    try {
        const response = await axios({
            url: `${SERVER_URL}${endpoint}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        console.log(`API Response (${SERVER_URL}${endpoint}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`API Request Error (${SERVER_URL}${endpoint}):`, error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
}

/**
 * Send data (POST request).
 * @param {string} endpoint - API endpoint.
 * @param {object} data - The payload to send.
 * @param {object} [headers={}] - Optional headers.
 * @returns {Promise<object>} - The response data.
 */
export async function postData(endpoint, data, headers = {}) {
    console.log("Posting to:", `${SERVER_URL}${endpoint}`);

    try {
        const response = await axios({
            url: `${SERVER_URL}${endpoint}`,
            method: 'POST',
            data,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        console.log(`API Response (POST ${SERVER_URL}${endpoint}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`API Request Error (POST ${SERVER_URL}${endpoint}):`, error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
}

/**
 * Update data (PUT request).
 * @param {string} endpoint - API endpoint.
 * @param {object} data - The new data to send.
 * @param {object} [headers={}] - Optional headers.
 * @returns {Promise<object>} - The response data.
 */
export async function putData(endpoint, data, headers = {}) {
    console.log("Putting to:", `${SERVER_URL}${endpoint}`);

    try {
        const response = await axios({
            url: `${SERVER_URL}${endpoint}`,
            method: 'PUT',
            data,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        console.log(`API Response (PUT ${SERVER_URL}${endpoint}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`API Request Error (PUT ${SERVER_URL}${endpoint}):`, error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
}

/**
 * Partially update data (PATCH request).
 * @param {string} endpoint - API endpoint.
 * @param {object} data - The data to update.
 * @param {object} [headers={}] - Optional headers.
 * @returns {Promise<object>} - The response data.
 */
export async function patchData(endpoint, data, headers = {}) {
    console.log("Patching to:", `${SERVER_URL}${endpoint}`);

    try {
        const response = await axios({
            url: `${SERVER_URL}${endpoint}`,
            method: 'PATCH',
            data,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        console.log(`API Response (PATCH ${SERVER_URL}${endpoint}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`API Request Error (PATCH ${SERVER_URL}${endpoint}):`, error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
}

/**
 * Delete data (DELETE request).
 * @param {string} endpoint - API endpoint.
 * @param {object} [headers={}] - Optional headers.
 * @returns {Promise<object>} - The response data.
 */
export async function deleteData(endpoint, headers = {}) {
    console.log("Deleting from:", `${SERVER_URL}${endpoint}`);

    try {
        const response = await axios({
            url: `${SERVER_URL}${endpoint}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        console.log(`API Response (DELETE ${SERVER_URL}${endpoint}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`API Request Error (DELETE ${SERVER_URL}${endpoint}):`, error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
}