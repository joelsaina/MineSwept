import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import instructions from './instructions.js';
const Index = () => {
    const navigation = useNavigation();

    const startGame = (numMines) => {
        // Navigate to the App screen (where the Minesweeper game is implemented) and pass the selected difficulty
        navigation.navigate('game', { numMines });
    };

    const startEasyGame = () => {
        startGame(10); // Start the game with 10 mines for easy difficulty
    };

    const navigateToInstructions = () => {
        navigation.navigate('instructions'); // Navigate to the Instructions screen
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>💣</Text>
            </View>
            <Text style={styles.title}>Minesweeper The Game</Text>
            <TouchableOpacity style={styles.startButton} onPress={startEasyGame}>
                <Text style={styles.buttonText}>▶️ Start The Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.instructionsButton} onPress={navigateToInstructions}>
                <Text style={styles.buttonText}>ℹ️ See Instructions</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 50,
        color: 'green',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: 'green',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginBottom: 10,
    },
    instructionsButton: {
        backgroundColor: 'gray',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Index;
