import React from "react";
import { View, StyleSheet, Image, Linking } from "react-native";
import { Card, Text, Button } from "@ui-kitten/components";

export default function HistoryObject({ item }) {
    return (
        <Card disabled={true} style={styles.card}>
            <View style={styles.container}>
                {/* Circle Icon */}
                <View style={styles.iconContainer}>
                    <Image source={require('../../assets/icons/history.png')} style={styles.icon} />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text category="s1" style={styles.titleText}>
                        {item.compression_type ? "File Compression" : "File Download"}
                    </Text>
                    <Text category="p2" appearance="hint">{item?.status}</Text>
                </View>

                {/* Download Button */}
                <Button
                    size="tiny"
                    appearance="outline"
                    style={styles.button}
                    onPress={() => Linking.openURL(item.compressed_file || item.file_path)}>
                    Download
                </Button>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 350,
        borderRadius: 10,
        paddingVertical: 12,
        backgroundColor: "#fff",
        opacity: 0.9,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#e6f0ff",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        width: 22,
        height: 22,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: "600",
        color: 'black'
    },
    button: {
        borderColor: "#007bff",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
});