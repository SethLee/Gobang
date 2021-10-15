import React, { Component } from 'react'
import ChessBoard from './ChessBoard'
import {DefaultButton, Stack, StackItem} from "@fluentui/react"
import { GAME_STEP } from '../Constants'
import PubSub from 'pubsub-js'

export default class Game extends Component {
    constructor(props){
        super(props);
        this.state={chesser:"black",winner:""};
    }
    gameStepSubscriber=(msg,data)=>{
        if(data===true){
            this.setState({chesser:"black"});
        }else{
            this.setState({chesser:"white"});
        }
    }
    gameStepToken=PubSub.subscribe(GAME_STEP,this.gameStepSubscriber);
    render() {
        return (
            <Stack horizontal>
                    <ChessBoard />
                    <Stack>
                        <StackItem>
                            {/* <h1>Game Over! Winner is </h1> */}
                        </StackItem>
                        <StackItem>
                            <h1>It's {this.state.chesser}'s turn</h1>
                        </StackItem>
                        <StackItem>
                            <DefaultButton>Revert</DefaultButton>
                        </StackItem>
                        <StackItem>
                            <DefaultButton>Restart</DefaultButton>
                        </StackItem>
                    </Stack>
            </Stack>
        )
    }
}
