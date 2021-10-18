import React, { Component, createRef } from 'react'
import { GAME_STEP, GAME_RESTART } from '../Constants'
import PubSub from 'pubsub-js'

export default class ChessBoard extends Component {
    constructor(props) {
        super(props);
        this.canvas = createRef();
        this.initGameData();
        this.blackFirst = props.blackFirst;
        this.isBlackTurn = this.blackFirst;
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
        if (data.gameOver) {
            this.blackFirst = !this.props.blackFirst;
            this.isBlackTurn = !this.blackFirst;
        } else {
            this.isBlackTurn = this.blackFirst;
        }
        var stepInfo = {
            isBlackTurn: !this.isBlackTurn,
            gameOver: false
        };
        PubSub.publish(GAME_STEP, stepInfo);
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
        var grd=pen.createRadialGradient(x+2,y-2,20,x-2,y+2,0);
        if(isBlackTurn){
            grd.addColorStop(0,"#0A0A0A");
            grd.addColorStop(1,"#636766");
        }else{
            grd.addColorStop(0,"#D1D1D1");
            grd.addColorStop(1,"#F9F9F9");
        }
        pen.fillStyle = grd;
        pen.fill();
    }
    hasWon(x, y, c) {
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
    putChess = (e) => {
        if (this.props.gameOver) {
            return;
        }
        var x = parseInt((e.clientX - this.canvas.current.getBoundingClientRect().left) / 40);
        var y = parseInt((e.clientY - this.canvas.current.getBoundingClientRect().top) / 40);
        if (this.gameData[x][y] !== "0") {
            return;
        }
        this.gameData[x][y] = this.isBlackTurn ? "b" : "w";
        this.drawChess(x * 40 + 20, y * 40 + 20, this.isBlackTurn);
        var stepInfo = {
            isBlackTurn: this.isBlackTurn,
            gameOver: this.hasWon(x, y, this.isBlackTurn ? "b" : "w")
        };
        PubSub.publish(GAME_STEP, stepInfo);
        this.isBlackTurn = !this.isBlackTurn;
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
