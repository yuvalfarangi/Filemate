import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
    ApplicationProvider, Layout, Text, Button
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "../../theme.json";
import { uploadFile } from '../../integrations/Cloudinary';
import { postData } from '../../integrations/ServerAPI';
import { getUser } from "../../integrations/authStorage";

export default function Compress() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [actionAlert, setActionAlert] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            if (userData) {
                console.log("Fetched user:", userData);
                setLoggedInUser(userData);
            } else {
                console.error("User data not found.");
            }
        };

        fetchUser();
    }, []);

    const pickFile = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync();
            if (!result.canceled && result.assets.length > 0) {
                setSelectedFile(result.assets[0]);
            }
        } catch (error) {
            console.error("Error picking file:", error);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error("No file selected.");
            setActionAlert("Please select a file first.");
            return;
        }

        if (!loggedInUser) {
            console.error("User not loaded yet.");
            setActionAlert("User not logged in.");
            return;
        }

        try {
            console.log("Uploading file:", selectedFile.uri);
            const uploadResult = await uploadFile(selectedFile.uri);
            console.log("Uploaded File:", uploadResult);

            if (!uploadResult.url) {
                console.error("File upload failed.");
                setActionAlert("File upload failed. Try again.");
                return;
            }

            // ✅ Ensure `loggedInUser` is available before making request
            const res = await postData("/file/compress/", {
                fileUrl: uploadResult.url,
                user_id: loggedInUser.id,
            });

            if (res) {
                console.log("Compression Response:", res);
                setActionAlert(res.message);
                setSelectedFile(null);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            setActionAlert("An error occurred while uploading.");
        }
    };

    return (
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <Layout style={styles.container}>
                <Text category="h2" style={styles.heading}>Compress</Text>
                <Text style={styles.subheading}>Reduce file size</Text>

                <View style={styles.inputContainer}>
                    {/* ✅ File Picker Button */}
                    <Button style={styles.button} onPress={pickFile}>
                        {selectedFile ? selectedFile.name : "Pick a File"}
                    </Button>

                    <Button
                        style={styles.button}
                        onPress={handleUpload}
                        disabled={!selectedFile || !loggedInUser}
                    >
                        Upload
                    </Button>

                    {actionAlert ? <Text style={styles.alert}>{actionAlert}</Text> : null}
                </View>
            </Layout>
        </ApplicationProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    heading: {
        textAlign: "center",
        paddingBottom: 10,
    },
    subheading: {
        paddingBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        width: "100%",
    },
    button: {
        marginVertical: 10,
    },
    alert: {
        textAlign: "center",
        marginTop: 10,
    },
});