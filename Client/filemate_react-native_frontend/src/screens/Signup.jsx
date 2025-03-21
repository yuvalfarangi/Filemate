import React, { useState } from "react";
import { StyleSheet, Image, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ApplicationProvider, Layout, Text, Button, Input } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "../../theme.json";
import { postData } from "../../integrations/ServerAPI";
import { uploadFile } from "../../integrations/Cloudinary";

export default function Signup({ visible, onClose, setIsUserLogin }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    };

    const confirmSignup = async () => {
        try {
            console.log("Sending signup request..."); // Debugging

            // Upload profile picture if selected
            let profilePictureUrl = "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"; // Default avatar
            if (profilePic) {
                const profilePictureUploadRes = await uploadFile(profilePic);
                profilePictureUrl = profilePictureUploadRes?.url || profilePictureUrl;
            }

            // Send registration request
            const response = await postData('/auth/register/', {
                username: username,
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password,
                profile_picture: profilePictureUrl
            });

            console.log("Signup Response:", response);

            if (response?.message) {
                alert("Signup Successful!");
                setFirstName('')
                setLastName('')
                setUsername('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setProfilePic('')
                setIsUserLogin(true)
                onClose(); // Close the modal
            } else {
                alert("Signup Failed: " + (response?.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("An error occurred while signing up.");
        }
    };

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
                            <Text category="h3">Sign Up to Filemate!</Text>

                            <TouchableOpacity onPress={pickImage} style={styles.profilePicContainer}>
                                {profilePic ? (
                                    <Image source={{ uri: profilePic }} style={styles.profilePic} />
                                ) : (
                                    <Image source={require('../../assets/icons/camera.png')} style={{ width: 30, height: 30 }} />
                                )}
                            </TouchableOpacity>

                            <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
                            <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
                            <Input placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
                            <Input placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                            <Input placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />

                            <Button style={styles.button} onPress={confirmSignup}>Sign Up</Button>
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
        alignItems: "center",
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    input: {
        width: "80%",
        marginVertical: 8,
    },
    button: {
        marginTop: 20,
    },
    profilePicContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#EAEAEA",
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
});