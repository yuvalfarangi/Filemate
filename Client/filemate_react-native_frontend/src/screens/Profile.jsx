import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from '../../theme.json';
import CircularAvatar from '../components/CircularAvatar';
import { removeAuthData, getUser } from "../../integrations/authStorage";

export default function Profile({ setIsUserLogin }) {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            console.log('Fetched user: ', userData);
            setLoggedInUser(userData);
        };
        fetchUser();
    }, []);

    const logout = async () => {
        await removeAuthData();
        setIsUserLogin(false);
    };

    return (
        <>
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Layout style={styles.container}>
                    {loggedInUser && (
                        <>
                            <CircularAvatar path={loggedInUser.profile_picture || "https://res.cloudinary.com/dc8swnx9j/image/upload/v1740842200/muu2trkkx4btdl0vwris.jpg"} size={100} />
                            <Text category="h1" style={styles.heading}>{loggedInUser.first_name} {loggedInUser.last_name}</Text>
                            <Text style={styles.subheading}>{loggedInUser.email}</Text>
                        </>
                    )}

                    <Button onPress={logout}>Log Out</Button>
                </Layout>
            </ApplicationProvider>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    heading: { textAlign: 'center', paddingTop: 20 },
    subheading: { paddingBottom: 50 },
});