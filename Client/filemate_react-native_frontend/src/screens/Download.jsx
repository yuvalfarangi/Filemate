import React, { useState, useEffect } from "react";
import { StyleSheet, View } from 'react-native';
import {
    ApplicationProvider, Layout, Text, Button, Input
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from '../../theme.json';
import { postData } from '../../integrations/ServerAPI';
import { getUser } from '../../integrations/authStorage';

export default function Download() {
    const [url, setUrl] = useState('');
    const [actionAlert, setActionAlert] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            if (userData && userData.id) {
                console.log("Fetched user:", userData);
                setLoggedInUser(userData);
            } else {
                console.error("User data not found.");
                setActionAlert("User not found. Please log in again.");
            }
        };

        fetchUser();
    }, []);

    const handleDownload = async () => {
        if (!url) {
            console.error("No URL provided.");
            setActionAlert("Please enter a valid URL.");
            return;
        }

        if (!loggedInUser || !loggedInUser.id) {
            console.error("User not loaded yet or invalid user ID.");
            setActionAlert("User not logged in.");
            return;
        }

        try {
            console.log("Requesting download for URL:", url);

            const userId = parseInt(loggedInUser.id, 10);
            if (isNaN(userId)) {
                console.error("Invalid user ID:", loggedInUser.id);
                setActionAlert("Invalid user ID.");
                return;
            }

            const res = await postData("/file/download/", {
                url: url,
                user_id: userId,
            });

            if (res) {
                console.log("Download Response:", res);
                setActionAlert(res.message);
                setUrl("");
            }
        } catch (error) {
            console.error("Download Error:", error);
            setActionAlert("An error occurred while downloading.");
        }
    };

    return (
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <Layout style={styles.container}>
                <Text category="h2" style={styles.heading}>Download</Text>
                <Text style={styles.subheading}>Download videos from URL</Text>

                <View style={styles.inputContainer}>
                    <Text category="label" style={styles.label}>Paste URL:</Text>


                    <Input
                        placeholder="Enter video URL"
                        value={url}
                        onChangeText={setUrl}
                        style={styles.input}
                    />


                    <Button
                        style={styles.button}
                        onPress={handleDownload}
                        disabled={!url || !loggedInUser}  // ✅ Prevents invalid requests
                    >
                        Download
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    heading: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    subheading: {
        paddingBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
    },
    label: {
        marginBottom: 5,
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
    alert: {
        textAlign: "center",
        marginTop: 10,
    },
});