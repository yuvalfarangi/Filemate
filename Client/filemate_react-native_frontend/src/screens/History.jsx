import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import { useFocusEffect } from '@react-navigation/native';
import * as eva from "@eva-design/eva";
import { default as theme } from '../../theme.json';
import HistoryObject from '../components/HistoryObject';
import fetchData from "../../integrations/ServerAPI";
import { getToken, getUser } from "../../integrations/authStorage";

export default function History() {
    const [historyItems, setHistoryItems] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Fetch user when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            if (userData && userData.id) {
                console.log("Fetched user:", userData);
                setLoggedInUser(userData);
            } else {
                console.error("User data not found.");
            }
        };

        fetchUser();
    }, []);

    // Re-fetch history every time the screen is focused
    useFocusEffect(
        useCallback(() => {
            const fetchHistory = async () => {
                if (!loggedInUser || !loggedInUser.id) return;

                try {
                    const token = await getToken();
                    const response = await fetchData(
                        `/file/history/?user_id=${loggedInUser.id}`,
                        { Authorization: token ? `Bearer ${token}` : '' }
                    );

                    if (response) {
                        setHistoryItems([
                            ...(response.compression_history || []),
                            ...(response.download_history || [])
                        ]);
                        console.log("History items:", response);
                    }
                } catch (error) {
                    console.error("Error fetching history:", error);
                }
            };

            fetchHistory();
        }, [loggedInUser])  // Runs every time the screen is focused and `loggedInUser` changes
    );

    return (
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
            <Layout style={styles.container}>
                <Text category="h2" style={styles.heading}>History</Text>
                <Text style={styles.subheading}>View your activity history</Text>
                <ScrollView>
                    {historyItems.length > 0 ? (
                        historyItems.map((item, index) => (
                            <HistoryObject key={index} item={item} />
                        ))
                    ) : (
                        <Text>No history found.</Text>
                    )}
                </ScrollView>
            </Layout>
        </ApplicationProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        textAlign: 'center',
        paddingTop: 20,
    },
    subheading: {
        paddingBottom: 20,
    },
});