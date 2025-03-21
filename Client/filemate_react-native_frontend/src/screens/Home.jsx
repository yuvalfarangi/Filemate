import { SafeAreaView, StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import { default as theme } from '../../theme.json';
import { useEffect, useState } from 'react';
import { getUser } from "../../integrations/authStorage";

export default function Home() {

    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {
            const userData = await getUser();
            console.log('Fetched user: ', userData);
            setLoggedInUser(userData);
        };

        fetchUser();

    }, []);

    return (
        <>
            <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                <Layout style={styles.container}>

                    <Text category='h1' style={styles.heading}>Welcome, {'\n'} {loggedInUser?.first_name}!</Text>
                    <Text category='h3' style={styles.subheading}>Get Started!</Text>


                </Layout>
            </ApplicationProvider>
        </>
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
        padding: 20
    },
    subheading: {
        textAlign: 'center',
        color: '#7DB4F0'
    }
});
