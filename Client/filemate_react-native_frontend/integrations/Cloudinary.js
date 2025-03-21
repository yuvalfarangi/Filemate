require('dotenv').config();
console.log("dotenv config loaded");


import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Cloudinary Config
const CLOUDINARY_UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL
const CLOUDINARY_PRESET = process.env.CLOUDINARY_PRESET

/**
 * Uploads a file to Cloudinary.
 * @param {string} fileUri - The local file URI from React Native.
 * @returns {Promise<object>} - Returns an object containing the file's public ID and URL.
 */
export async function uploadFile(fileUri) {
    try {
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const formData = new FormData();
        formData.append('file', `data:image/jpeg;base64,${base64}`);
        formData.append('upload_preset', CLOUDINARY_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Upload failed');
        }

        return {
            id: data.public_id,
            url: data.secure_url,
        };
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
}

/**
 * Fetches a file from Cloudinary using its URL.
 * @param {string} fileUrl - The Cloudinary file URL.
 * @returns {Promise<string>} - Returns the downloaded file's local URI.
 */
export async function fetchFile(fileUrl) {
    try {
        const localUri = `${FileSystem.cacheDirectory}downloaded_file.jpg`;
        const { uri } = await FileSystem.downloadAsync(fileUrl, localUri);
        return uri;
    } catch (error) {
        console.error('Error fetching file from Cloudinary:', error);
        throw error;
    }
}