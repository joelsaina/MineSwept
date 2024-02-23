// Instructions.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Instructions = () => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                <Text style={styles.goBackText}>Return</Text>
            </TouchableOpacity>
            <Text style={styles.title}>To Play</Text>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.text}>
                    <Text style={styles.subtitle}>Objective:</Text>
                    {'\n'}Your primary aim is to systematically unveil each tile on the board, ensuring that no
                    mines remain concealed beneath them, thereby achieving full exposure of safe zones.
                    {'\n\n'}
                    <Text style={styles.subtitle}> To Play:</Text>
                    {'\n'}1. Choose a tile to unveil the concealed contents beneath it.
                    {'\n'}2.In the event of revealing a tile containing a mine, your game will conclude with a loss.
                    {'\n'}3. Uncovering a tile devoid of a mine will display a numerical indicator, denoting the count of neighboring tiles containing mines, aiding in mine avoidance.
                    {'\n'}4.Employ logical deduction to pinpoint the locations of the mines and systematically reveal all tiles devoid of mines.
                    {'\n\n'}
                    <Text style={styles.subtitle}>Scoring:</Text>
                    {'\n'}-With each tile revealing devoid of a mine, you accrue points as a reward.
                    {'\n'}-Strive to maximize your point total by uncovering as many tiles as possible while avoiding any encounters with mines.
                    {'\n\n'}
                    <Text style={styles.subtitle}>To conclude the game:</Text>
                    {'\n'}- The game concludes when either:
                    {'\n'}   • Victory is achieved when all non-mine tiles are uncovered.
                    {'\n'}   • Defeat occurs upon uncovering a tile containing a mine.
                    {'\n'}- Opting to conclude the game prematurely via the "End Game" button results in a score of zero.
                    {'\n\n'}
                    <Text style={styles.subtitle}>High Score:</Text>
                    {'\n'}- The highest achieved score is retained for future reference.
                    {'\n'}- Exceeding your previous highest score results in an automatic update to reflect the new achievement.
                    {'\n'}- You possess the autonomy to reset the high score according to your preference.
                    {'\n\n'}
                    <Text style={styles.subtitle}>Restarting:</Text>
                    {'\n'}- Initiate a fresh game at any moment by activating the "Restart" button.
                    {'\n\n'}
                    <Text style={styles.subtitle}>Changing Difficulty:</Text>
                    {'\n'}- You can change the size of the game board using the buttons labeled "5x6", "5x6", and "7x8".
                    {'\n\n'}
                    <Text style={styles.subtitle}>Navigation:</Text>
                    {'\n'}- Should this game be integrated within a larger application, utilize the "Go Back to the Main Page" button to return to the main interface.
                    {'\n\n'}
                    That concludes the instructions! Enjoy your Mines experience, and may you derive pleasure from the challenge of revealing all the non-mine tiles!
                </Text>
            </ScrollView>
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
    goBackButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        padding: 10,
    },
    goBackText: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    subtitle: {
        fontWeight: 'bold',
    },
});

export default Instructions;
