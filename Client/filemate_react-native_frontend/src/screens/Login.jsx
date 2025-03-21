import React, { useState } from "react";
import { Modal, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { ApplicationProvider, Layout, Text, Button, Input } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from '../../theme.json';
import { postData } from "../../integrations/ServerAPI";
import { storeAuthData } from "../../integrations/authStorage";

export default function Login({ visible, onClose, setIsUserLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const confirmSignin = async () => {
        try {
            console.log("Sending signup request...");

            // Send registration request
            const response = await postData('/auth/login/', {
                username: username,
                password: password,
            });

            if (response?.user && response?.token) {
                await storeAuthData(response.token, response.refresh_token, response.user);
                setIsUserLogin(true)
                onClose(); // Close the modal
            } else {
                alert("Signin Failed: " + (response?.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("An error occurred while signing in.");
        }
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <ScrollView contentContainerStyle={styles.modalBackground}>
                    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
                        <Layout style={styles.container}>
                            <Text category='h3'>Log in to Filemate!</Text>

                            <Input placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
                            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

                            <Button onPress={confirmSignin}>Log In</Button>
                        </Layout>
                    </ApplicationProvider>
                </ScrollView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flexGrow: 1,
        justifyContent: "center",
    },
    container: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    input: {
        width: "80%",
        marginVertical: 8,
    },
});