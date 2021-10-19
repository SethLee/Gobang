import React, { Component } from 'react'
import ChessBoard from './ChessBoard'
import { DefaultButton, Stack, StackItem } from "@fluentui/react"
import { GAME_STEP, GAME_RESTART } from '../Constants'
import PubSub from 'pubsub-js'

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.initGameData();
        this.state = {
            round: 1,
            blackFirst: true,
            isBlackTurn: true,
            gameOver: false,
            winner: "",
            blackWins: 0,
            whiteWins: 0,
        };
    }

    initGameData = () => {
        this.gameData = [];
        for (var i = 0; i <= 15; i++) {
            this.gameData[i] = [];
            for (var j = 0; j <= 15; j++) {
                this.gameData[i][j] = "0";
            }
        }
    }

    gameStepSubscriber = (msg, data) => {
        this.gameData[data.x][data.y] = this.state.isBlackTurn ? "b" : "w";
        if (this.checkGameOver(data.x, data.y, this.gameData[data.x][data.y])) {
            this.setState({
                gameOver: true,
                winner: this.state.isBlackTurn ? "Black" : "White",
                blackWins: this.state.isBlackTurn ? this.state.blackWins + 1 : this.state.blackWins,
                whiteWins: this.state.isBlackTurn ? this.state.whiteWins : this.state.whiteWins + 1,
                isBlackTurn: !this.state.isBlackTurn,
            });
        } else {
            this.setState({
                gameOver: false,
                isBlackTurn: !this.state.isBlackTurn,
            });
        }
    }
    gameStepToken = PubSub.subscribe(GAME_STEP, this.gameStepSubscriber);

    handleRestart = () => {
        if (this.state.gameOver) {
            this.setState({
                round: this.state.round + 1,
                gameOver: false,
                blackFirst: !this.state.blackFirst,
                isBlackTurn: !this.state.blackFirst
            });
        } else {
            this.setState({
                round: this.state.round,
                gameOver: false,
                blackFirst: this.state.blackFirst,
                isBlackTurn: this.state.blackFirst
            });
        }
        this.initGameData();
        PubSub.publish(GAME_RESTART, null);
    }

    handleSurrender = () => {
        this.setState({
            winner: this.state.isBlackTurn ? "White" : "Black",
            blackWins: this.state.isBlackTurn ? this.state.blackWins : this.state.blackWins + 1,
            whiteWins: this.state.isBlackTurn ? this.state.whiteWins + 1 : this.state.whiteWins,
            blackFirst: !this.state.blackFirst,
            isBlackTurn: !this.state.blackFirst,
            round: this.state.round + 1,
        });
        this.initGameData();
        PubSub.publish(GAME_RESTART, null)
    }

    render() {
        return (
            <Stack horizontal>
                <Stack>
                    <Stack horizontal disableShrink horizontalAlign="space-evenly">
                        <StackItem>
                            <h1>
                                <table style={{ textAlign: 'center' }}>
                                    <tr>
                                        <th>Black</th>
                                        <th>:</th>
                                        <th>White</th>
                                    </tr>
                                    <tr>
                                        <td style={{ color: 'red' }}>{this.state.blackWins}</td>
                                        <td>:</td>
                                        <td style={{ color: 'red' }}>{this.state.whiteWins}</td>
                                    </tr>
                                </table>
                            </h1>
                        </StackItem>
                        <StackItem>
                            <h1>Round {this.state.round}, {this.state.blackFirst ? "Black" : "White"} First</h1>
                        </StackItem>
                    </Stack>
                    <StackItem>
                        <ChessBoard gameOver={this.state.gameOver} isBlackTurn={this.state.isBlackTurn} />
                    </StackItem>
                </Stack>
                <Stack verticalAlign="space-evenly">
                    <StackItem>
                        {this.state.gameOver ? <h1>Game Over! Winner is {this.state.winner}</h1> : <h1>Current Player: {this.state.isBlackTurn ? "Black" : "White"}</h1>}
                    </StackItem>
                    <StackItem>
                        <DefaultButton onClick={this.handleRestart}>Restart</DefaultButton>
                    </StackItem>
                    <StackItem>
                        <DefaultButton onClick={this.handleSurrender} disabled={this.state.gameOver}>Surrender</DefaultButton>
                    </StackItem>
                </Stack>
            </Stack>
        )
    }

    checkGameOver = (x, y, c) => {
        if (this.countHorizontal(x, y, c) === 5) {
            return true;
        } else if (this.countVertical(x, y, c) === 5) {
            return true;
        } else if (this.countSlash(x, y, c) === 5) {
            return true;
        } else if (this.countBackSlash(x, y, c) === 5) {
            return true;
        } else {
            return false;
        }
    }

    countHorizontal(x, y, c) {
        var count = 1;
        for (var i = x - 1; i >= 0; i--) {
            if (this.gameData[i][y] === c) {
                count++;
            } else {
                break;
            }
        }
        for (i = x + 1; i <= 15; i++) {
            if (this.gameData[i][y] === c) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    countVertical(x, y, c) {
        var count = 1;
        for (var i = y - 1; i >= 0; i--) {
            if (this.gameData[x][i] === c) {
                count++;
            } else {
                break;
            }
        }
        for (i = y + 1; i <= 15; i++) {
            if (this.gameData[x][i] === c) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    countSlash(x, y, c) {
        var count = 1;
        for (var i = x - 1, j = y + 1; i >= 0 && j <= 15; i--, j++) {
            if (this.gameData[i][j] === c) {
                count++;
            } else {
                break;
            }
        }
        for (i = x + 1, j = y - 1; i <= 15 && j >= 0; i++, j--) {
            if (this.gameData[i][j] === c) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    countBackSlash(x, y, c) {
        var count = 1;
        for (var i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
            if (this.gameData[i][j] === c) {
                count++;
            } else {
                break;
            }
        }
        for (i = x + 1, j = y + 1; i <= 15 && j <= 15; i++, j++) {
            if (this.gameData[i][j] === c) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }
}
