import React, { Component } from 'react'
import ChessBoard from './ChessBoard'
import { DefaultButton, Stack, StackItem } from "@fluentui/react"
import { GAME_STEP, GAME_RESTART } from '../Constants'
import PubSub from 'pubsub-js'

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blackFirst: true,
            nextPlayer: "Black",
            gameOver: false,
            winner: ""
        };
    }
    gameStepSubscriber = (msg, data) => {
        if (data.gameOver) {
            this.setState({
                nextPlayer: data.isBlackTurn ? "White" : "Black",
                gameOver: true,
                blackFirst: !this.state.blackFirst,
                winner: data.isBlackTurn ? "Black" : "White"
            });
        } else {
            this.setState({
                nextPlayer: data.isBlackTurn ? "White" : "Black",
                gameOver: false,
            });
        }
    }
    gameStepToken = PubSub.subscribe(GAME_STEP, this.gameStepSubscriber);
    handleRestart = () => {
        PubSub.publish(GAME_RESTART, { gameOver: this.state.gameOver });
    }
    render() {
        return (
            <Stack horizontal>
                <ChessBoard gameOver={this.state.gameOver} blackFirst={this.state.blackFirst} />
                <Stack>
                    <StackItem>
                        {this.state.gameOver ? <h1>Game Over! Winner is {this.state.winner}</h1> : <h1>Next Player: {this.state.nextPlayer}</h1>}
                    </StackItem>
                    {/* <StackItem>
                            <DefaultButton>Revert</DefaultButton>
                        </StackItem> */}
                    <StackItem>
                        <DefaultButton onClick={this.handleRestart}>Restart</DefaultButton>
                    </StackItem>
                </Stack>
            </Stack>
        )
    }
}
