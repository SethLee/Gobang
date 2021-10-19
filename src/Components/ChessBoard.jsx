import React, { Component, createRef } from 'react'
import { GAME_STEP, GAME_RESTART } from '../Constants'
import PubSub from 'pubsub-js'

export default class ChessBoard extends Component {
    constructor(props) {
        super(props);
        this.canvas = createRef();
        this.initGameData();
    }

    componentDidMount() {
        this.drawChessBoard();
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

    restartGame = (msg, data) => {
        var pen = this.canvas.current.getContext("2d");
        pen.putImageData(this.clearBoard, 0, 0);
        this.initGameData();
    }
    restartToken = PubSub.subscribe(GAME_RESTART, this.restartGame);

    drawChessBoard() {
        var pen = this.canvas.current.getContext("2d");
        for (var i = 0; i <= 600; i += 40) {
            pen.beginPath();
            pen.moveTo(20, 20 + i);
            pen.lineTo(580, 20 + i);
            pen.moveTo(20 + i, 20);
            pen.lineTo(20 + i, 580);
            pen.closePath();
            pen.stroke();
        }
        this.clearBoard = pen.getImageData(0, 0, 600, 600);
    }

    drawChess(x, y, isBlackTurn) {
        var pen = this.canvas.current.getContext("2d");
        pen.beginPath();
        pen.arc(x, y, 20, 0, 2 * Math.PI);
        var grd = pen.createRadialGradient(x + 2, y - 2, 20, x - 2, y + 2, 0);
        if (isBlackTurn) {
            grd.addColorStop(0, "#0A0A0A");
            grd.addColorStop(1, "#636766");
        } else {
            grd.addColorStop(0, "#D1D1D1");
            grd.addColorStop(1, "#F9F9F9");
        }
        pen.fillStyle = grd;
        pen.fill();
    }

    putChess = (e) => {
        if (this.props.gameOver) {
            return;
        }
        var x = parseInt((e.clientX - this.canvas.current.getBoundingClientRect().left) / 40);
        var y = parseInt((e.clientY - this.canvas.current.getBoundingClientRect().top) / 40);
        if (this.gameData[x][y] !== "0") {
            return;
        }
        this.gameData[x][y] = "1";
        this.drawChess(x * 40 + 20, y * 40 + 20, this.props.isBlackTurn);
        var stepInfo = {
            x: x,
            y: y,
        };
        PubSub.publish(GAME_STEP, stepInfo);
    }

    render() {
        return (
            <canvas
                ref={this.canvas}
                onClick={this.putChess}
                width="600px" height="600px"
                style={{ backgroundColor: '#E6B380' }}>
            </canvas>
        )
    }
}
