import React, { Component, createRef } from 'react'
import { GAME_STEP } from '../Constants'
import PubSub from 'pubsub-js'

export default class ChessBoard extends Component {
    constructor(props){
        super(props);
        this.blackFirst=true;
        this.blackTurn=true;
        this.canvas=createRef();
        this.gameOver=false;
        this.gameData=[];
        for(var i=0;i<15;i++){
            this.gameData[i]=[];
            for(var j=0;j<15;j++){
                this.gameData[i][j]="0";
            }
        }
    }
    componentDidMount(){
        this.drawChessBoard();
    }
    drawChessBoard(){
        var pen = this.canvas.current.getContext("2d");
        for(var i = 0;i<=600;i+=40){
            pen.beginPath();
            pen.moveTo(20,20+i);
            pen.lineTo(580,20+i);
            pen.moveTo(20+i,20);
            pen.lineTo(20+i,580);
            pen.closePath();
            pen.stroke();
        }
    }
    drawChess(x,y,color){
        var pen = this.canvas.current.getContext("2d");
        pen.beginPath();
        pen.arc(x,y,20,0,2*Math.PI);
        pen.fillStyle=color;
        pen.fill();
    }
    hasWon(x,y,c){
        if(this.countHorizontal(x,y,c)===5){
            return true;
        }else if(this.countVertical(x,y,c)===5){
            return true;
        }else if(this.countSlash(x,y,c)===5){
            return true;
        }else if(this.countBackSlash(x,y,c)===5){
            return true;
        }else{
            return false;
        }
    }
    countHorizontal(x,y,c){
        var count=1;
        for(var i=1;i<x;i++){
            if(this.gameData[x-i][y]===c){
                count++;
            }else{
                break;
            }
        }
        for(var j=1;j<15-x;j++){
            if(this.gameData[x+j][y]===c){
                count++;
            }else{
                break;
            }
        }
        return count;
    }
    countVertical(x,y,c){
        var count=1;
        for(var i=1;i<y;i++){
            if(this.gameData[x][y-i]===c){
                count++;
            }else{
                break;
            }
        }
        for(var j=1;j<15-y;j++){
            if(this.gameData[x][y+j]===c){
                count++;
            }else{
                break;
            }
        }
        return count;
    }
    countSlash(x,y,c){
        var count=1;
        for(var i=x-1,j=y+1;i>=0&&j<=15;i--,j++){
            if(this.gameData[i][j]===c){
                count++;
            }else{
                break;
            }
        }
        for(i=x+1,j=y-1;i<=15&&j>=0;i++,j--){
            if(this.gameData[i][j]===c){
                count++;
            }else{
                break;
            }
        }
        return count;
    }
    countBackSlash(x,y,c){
        var count=1;
        for(var i=x-1,j=y-1;i>=0&&j>=0;i--,j--){
            if(this.gameData[i][j]===c){
                count++;
            }else{
                break;
            }
        }
        for(i=x+1,j=y+1;i<=15&&j<=15;i++,j++){
            if(this.gameData[i][j]===c){
                count++;
            }else{
                break;
            }
        }
        return count;
    }
    putChess=(e)=>{
        if(this.gameOver){
            return;
        }
        var x=parseInt((e.clientX-this.canvas.current.getBoundingClientRect().left)/40);
        var y=parseInt((e.clientY-this.canvas.current.getBoundingClientRect().top)/40);
        if(this.gameData[x][y]!=="0"){
            return;
        }
        this.gameData[x][y]=this.blackTurn?"b":"w";
        this.drawChess(x*40+20,y*40+20,this.blackTurn?"black":"white")
        if(this.hasWon(x,y,this.blackTurn?"b":"w")){
            this.gameOver=true;
            // alert(this.blackTurn?"black win!":"white win!");
            // this.blackFirst=!this.blackFirst;
            // return;
        }
        this.blackTurn=!this.blackTurn;
        PubSub.publish(GAME_STEP,this.blackTurn);
    }
    render() {
        return (
            <canvas 
                ref={this.canvas} 
                onClick={this.putChess}
                width="600px" height="600px" 
                style={{backgroundColor:'#E6B380'}}>
            </canvas>
        )
    }
}
