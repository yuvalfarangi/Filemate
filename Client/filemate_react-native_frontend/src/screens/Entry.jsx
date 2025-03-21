import React, { useState } from "react";
import { StyleSheet, ScrollView } from 'react-native';
import { ApplicationProvider, Layout, Text, Button } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from '../../theme.json';
import Login from './Login';
import Signup from './Signup';

export default function Entry({ setIsUserLogin }) {
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [isSignupVisible, setIsSignupVisible] = useState(false);

    return (
        <>
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Layout style={styles.container}>
                    <Layout style={styles.horizontalContainer}>
                        <Text category='h3'>Welcome to</Text>
                        <Text category='h3' style={styles.subheading}>Filemate!</Text>
                    </Layout>

                    <Layout style={styles.horizontalContainer}>
                        <Button onPress={() => setIsLoginVisible(true)}>Log In</Button>
                        <Button onPress={() => setIsSignupVisible(true)}>Sign Up</Button>
                    </Layout>
                </Layout>
            </ApplicationProvider>

            {/* Signup Modal */}
            <Signup visible={isSignupVisible} setIsUserLogin={setIsUserLogin} onClose={() => setIsSignupVisible(false)} />

            {/* Login Modal */}
            <Login visible={isLoginVisible} setIsUserLogin={setIsUserLogin} onClose={() => setIsLoginVisible(false)} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subheading: {
        color: '#7DB4F0',
    },
    horizontalContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 10,
        padding: 10,
    },
});