import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CircularAvatar = ({ path, size }) => {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <Image
                source={{ uri: path }}
                style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'cover',
    },
});

export default CircularAvatar;