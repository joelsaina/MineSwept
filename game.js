import React, { useState, useEffect } from 'react';
/**
 * File     -   game.js
 * Credit   -   Gagan Rai
 * Author   -   Joel Saina
 */
import { View, Text, TouchableOpacity, StyleSheet, Alert, Button, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BOARD_SIZE = 5;
const HIGH_SCORE_KEY = 'mines_high_score';

const generateBoard = (size) => {
    const board = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({
            isMine: false,
            isOpen: false,
        }))
    );

    let x, y;
    do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
    } while (board[x][y].isMine);

    board[x][y].isMine = true;

    return board;
};

const Game = () => {
    const navigation = useNavigation();

    const [boardSize, setBoardSize] = useState(5);
    const [board, setBoard] = useState(generateBoard(boardSize));
    const [timer, setTimer] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [endGameByMine, setEndGameByMine] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [animatedValue] = useState(new Animated.Value(1));
    const [tilesRevealed, setTilesRevealed] = useState(0); // Track the number of revealed tiles

    useEffect(() => {
        let intervalId;

        if (gameStarted) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [gameStarted]);

    useEffect(() => {
        const loadHighScore = async () => {
            try {
                const storedHighScore = await AsyncStorage.getItem(HIGH_SCORE_KEY);
                if (storedHighScore !== null) {
                    setHighScore(parseInt(storedHighScore, 10));
                }
            } catch (error) {
                console.error('Error loading high score:', error);
            }
        };

        loadHighScore();
    }, []);

    useEffect(() => {
        const saveHighScore = async () => {
            try {
                if ((isWin && score > 0 && score > highScore) || (endGameByMine && score > 0 && score > highScore)) {
                    await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
                    setHighScore(score);
                }
            } catch (error) {
                console.error('Error saving high score:', error);
            }
        };

        if (!gameStarted) {
            saveHighScore();
        }
    }, [gameStarted, score, endGameByMine, isWin, highScore]);

    const revealTile = (x, y) => {
        if (!gameStarted) {
            setGameStarted(true);
        }

        const updatedBoard = [...board];
        const tile = updatedBoard[x][y];

        if (tile.isMine) {
            setScore(0);
            endGame(false);
        } else {
            tile.isOpen = true;
            setBoard(updatedBoard);
            const points = Math.floor(10 * Math.pow(1.015, tilesRevealed)); // Calculate points with multiplier
            setScore((prevScore) => prevScore + points);
            setTilesRevealed(tilesRevealed + 1); // Increment the count of revealed tiles
            checkWinCondition();
        }
    };

    const checkWinCondition = () => {
        const remainingTiles = board.flat().filter((tile) => !tile.isOpen && !tile.isMine);
        if (remainingTiles.length === 0) {
            setIsWin(true);
            endGame(true);
        }
    };

    const endGame = (isWin) => {
        setGameStarted(false);

        if (isWin) {
            Alert.alert(
                'Congratulations!',
                `You won in ${timer} seconds! Your Score: ${score}`,
                [{ text: 'Restart', onPress: restartGame }]
            );
        } else if (endGameByMine) {
            Alert.alert(
                'Game Over',
                `You ended the game early. Time: ${timer} seconds. Your Score: ${score}`,
                [{ text: 'Restart', onPress: restartGame }]
            );
        } else {
            Alert.alert(
                'Game Over',
                `You hit a mine! Time: ${timer} seconds. Your Score: 0`,
                [{ text: 'Restart', onPress: restartGame }]
            );
        }
    };

    const restartGame = () => {
        setBoard(generateBoard(boardSize));
        setTimer(0);
        setGameStarted(false);
        setScore(0);
        setEndGameByMine(false);
        setIsWin(false);
        setTilesRevealed(0); // Reset the count of revealed tiles
    };

    const endGameEarly = () => {
        setEndGameByMine(true);
        Alert.alert(
            'End Game',
            'Coward!',
            [{ text: 'Restart', onPress: restartGame }]
        );
    };

    const resetHighScore = async () => {
        try {
            await AsyncStorage.setItem(HIGH_SCORE_KEY, '0');
            setHighScore(0);
        } catch (error) {
            console.error('Error resetting high score:', error);
        }
    };

    const addMines = () => {
        const updatedBoard = board.map(row =>
            row.map(tile => ({
                ...tile,
                isMine: Math.random() < 0.2 // Adjust the probability as needed
            }))
        );
        setBoard(updatedBoard);
    };

    const handleDifficultyChange = (size) => {
        setBoardSize(size);
        setBoard(generateBoard(size));
        restartGame();
    };

    const handleTilePressIn = () => {
        Animated.timing(animatedValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handleTilePressOut = () => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>Time: {timer}s</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.highScoreText}>High Score: {highScore}</Text>
            {gameStarted && (
                <Button title="End Game" onPress={endGameEarly} />
            )}
            <Button title="Reset High Score" onPress={resetHighScore} />
            <View style={styles.difficultyButtonContainer}>
                <Button title="5x5" onPress={() => handleDifficultyChange(5)} />
                <Button title="6x6" onPress={() => handleDifficultyChange(6)} />
                <Button title="7x7" onPress={() => handleDifficultyChange(7)} />
            </View>
            <Button title="Add Mines" onPress={addMines} />
            <View style={styles.boardContainer}>
                {board.map((row, x) => (
                    <View key={x} style={styles.row}>
                        {row.map((_, y) => (
                            <TouchableOpacity
                                key={`${x}-${y}`}
                                style={[
                                    styles.tile,
                                    board[x][y].isOpen && styles.openTile,
                                    board[x][y].isMine && board[x][y].isOpen && styles.hitMine,
                                    { transform: [{ scale: animatedValue }] },
                                ]}
                                onPressIn={handleTilePressIn}
                                onPressOut={handleTilePressOut}
                                onPress={() => {
                                    if (!board[x][y].isOpen) {
                                        revealTile(x, y);
                                        if (board[x][y].isMine) {
                                            setBoard((prevBoard) => {
                                                const updatedBoard = [...prevBoard];
                                                updatedBoard[x][y].isOpen = true;
                                                return updatedBoard;
                                            });
                                        }
                                    }
                                }}
                                disabled={board[x][y].isOpen}
                            >
                                {board[x][y].isOpen && !board[x][y].isMine && (
                                    <Text style={styles.pointsText}>{Math.floor(10 * Math.pow(1.015, tilesRevealed))}</Text>
                                )}
                                {board[x][y].isOpen && board[x][y].isMine && (
                                    <Text style={styles.bombText}>{`💣`}</Text>
                                )}
                                {!board[x][y].isMine && board[x][y].isOpen && (
                                    <Text style={styles.tileText}>👑</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
            <Button title="RETURN TO THE MAIN PAGE" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
    },
    difficultyButtonContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    boardContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    tile: {
        width: 55,
        height: 55,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
        backgroundColor: '#555',
    },
    openTile: {
        backgroundColor: '#6495ED',
    },
    hitMine: {
        backgroundColor: '#FF00FF',
    },
    bombText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#',
    },
    tileText: {
        fontSize: 18,
    },
    timerText: {
        fontSize: 20,
        marginBottom: 10,
        color: '#ccc',
    },
    scoreText: {
        fontSize: 16,
        marginTop: 10,
        color: '#ccc',
    },
    highScoreText: {
        fontSize: 16,
        marginTop: 10,
        color: '#ccc',
    },
    pointsText: {
        fontSize: 16,
        color: '#ccc',
        fontWeight: 'bold',
    },
});

export default Game;
