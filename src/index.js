import React from 'react';
import ReactDOM from 'react-dom';
// import Header from './header';
// import SidebarComponent from './sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import  Container  from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


const Wrapper = props => props.children;

const Square =(props)=> {

    return (
        // <Col>
            <Button className={props.className} onClick={props.squareClick} style={props.style}>
                {props.value}
            </Button>
        // {/* </Col> */}
    );
}


const Board =(props)=> {
    const list = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    const renderSquare=(i)=> {
        

        const winList = list[props.meta]?list[props.meta].includes(i):null;
        return <Square 
        value={props.squares[i]}
        squareClick={(e)=>props.onClick(i,e)}
        className={["square",winList?"winSquare":"square"].join(" ")}
        />;
    }
    return (
            // <Container className="board m-container " fluid={true}>
            <Wrapper>
                {/* <div className="status">Status: {status}</div> */}
                <Row className="board-row justify-content-md-center justify-content-xl-center" 
                >
                <Col
                    
                    xs={8} 
                    sm={{offset:3,span:5}}
                    md={{offset:0,span:3}} 
                    lg={{offset:0,span:3}} 
                    xl={{span:3}}
                    >
                    <ButtonGroup>
                        {renderSquare(0)}
                        {renderSquare(1)}
                        {renderSquare(2)}
                    </ButtonGroup>
                </Col>
                </Row>
                <Row className="board-row justify-content-md-center justify-content-xl-center" 
                >
                <Col
                    xs={8} 
                    sm={{offset:3,span:3}}
                    md={{offset:0,span:3}} 
                    lg={{offset:0,span:3}} 
                    xl={{span:3}}
                    >
                    <ButtonGroup>
                        {renderSquare(3)}
                        {renderSquare(4)}
                        {renderSquare(5)}
                    </ButtonGroup>
                </Col>
                </Row>
                <Row className="board-row justify-content-md-center justify-content-xl-center"
                >
                <Col
                    xs={8} 
                    sm={{offset:3,span:4}}
                    md={{offset:0,span:3}} 
                    lg={{offset:0,span:3}} 
                    xl={{offset:0,span:3}}
                    >
                    <ButtonGroup>
                        {renderSquare(6)}
                        {renderSquare(7)}
                        {renderSquare(8)}
                    </ButtonGroup>
                </Col>
                </Row>
            </Wrapper>
            // {/* </Container> */}
        );
}


const Game =(props)=> {
    const [gameState,setGameState]= React.useState({
        stepNumber:0,
        history:[{
            squares: Array(9).fill(null)
        }],
    });

    const initialGameState =  {
        stepNumber:0,
        history:[{
            squares: Array(9).fill(null)
        }],
    };

    const [scoreKeeper, setScoreKeeper] = React.useState({
        winnerScore: {
            X: 0,
            O: 0
        },
        recentWinner:null
    });

    const current= gameState.history[gameState.stepNumber]

    const [boardState,setBoardState] = React.useState({
        squares: current.squares,
        xIsNext:false,
        boardDone:false,
        isBacked:false
        // draw:false
    });

    
    const initialBoardState =  {
        squares: Array(9).fill(null),
        xIsNext:false,
        boardDone:false,
        isBacked:false
        // draw:false
    };

    const [sidebarState,setSidebarState] = React.useState({
        isOpen:false
        // draw:false
    });

    let status; 

    const squareClickHandler = (i,e) => {
        e.preventDefault();
        if (boardState.squares[i] == null && !boardState.boardDone) {
            const squares = current.squares.slice();

            const history = gameState.history.slice();
            history.push({
                squares: squares
            });

            setGameState({
                ...gameState,
                stepNumber: gameState.stepNumber + 1,
                history: history
            });


            squares[i] = boardState.xIsNext ? "O" : "X";

            setBoardState({
                ...boardState,
                xIsNext: !boardState.xIsNext,
                squares: squares,
                winner: winnerChecker(squares)?winnerChecker(squares).winner:null,
                boardDone: winnerChecker(squares) ===null ? false : true,
                isBacked:false
            });
        } else if (boardState.squares[i] != null && !boardState.boardDone) {
            alert("Square already occupied");
        }
    };

    
    React.useEffect(() => {
        if (boardState.isBacked) {
            const recentWinner = scoreKeeper.recentWinner;
            const winnerScore = {
                ...scoreKeeper.winnerScore
            }
            winnerScore.X = recentWinner === "X" ? scoreKeeper.winnerScore.X - 1 : scoreKeeper.winnerScore.X;
            winnerScore.O = recentWinner === "O" ? scoreKeeper.winnerScore.O - 1 : scoreKeeper.winnerScore.O;
            setScoreKeeper({
                ...scoreKeeper,
                winnerScore: winnerScore,
                recentWinner: null
            });
        }
        if (boardState.winner != null) {
            const winnerScore = {
                ...scoreKeeper.winnerScore
            }
            winnerScore.X = boardState.winner === "X" ? scoreKeeper.winnerScore.X + 1 : scoreKeeper.winnerScore.X;
            winnerScore.O = boardState.winner === "O" ? scoreKeeper.winnerScore.O + 1 : scoreKeeper.winnerScore.O;
            setScoreKeeper({
                ...scoreKeeper,
                winnerScore: winnerScore,
                recentWinner: boardState.winner
            });
        }
        // eslint-disable-next-line
    }, [boardState.winner, boardState.isBacked]);

    const goBackHandler = (e) => {
        e.preventDefault();
        if(gameState.stepNumber>0){
            const history = gameState.history.slice();
            history.pop();
            setGameState({
                ...gameState,
                history: history,
                stepNumber: gameState.stepNumber - 1
            });

            const squares = history[gameState.stepNumber - 1];

            setBoardState({
                ...boardState,
                xIsNext: !boardState.xIsNext,
                squares: squares,
                winner: null,
                boardDone: false,
                isBacked:true
            });
        }
    };

    const newBoardHandler=(e)=>{
        e.preventDefault();
        setBoardState(
            initialBoardState
        );
        setGameState(
            initialGameState
        );
        setSidebarState({
            ...sidebarState,
            isOpen:false
        })
    };

    status = boardState.boardDone? (boardState.winner==='XO'?`It's a draw!!`:`Player ${boardState.winner} wins`):`Player ${boardState.xIsNext?"O":"X"} is playing...`
    // const openSideBarHandler=()=>{
    //     console.log("hit openSideBar")
    //     setSidebarState({
    //         ...sidebarState,
    //         isOpen:!sidebarState.isOpen
    //     })
    // }
    return (
        // <Container className="m-container" >
        //     <Row className="justify-content-sm-center">
        //         <Col xs={5} className="box-it2">1 of 2</Col>
        //     </Row>
        //     <Row className="justify-content-sm-center">
        //         <Col>1 of 3</Col>
        //         <Col>2 of 3</Col>
        //         <Col>3 of 3</Col>
        //     </Row>
        // </Container>

        <Container className="m-container" >
            <Row className="game justify-content-sm-center" >
                <Col 
                className="status" 
                xs={8} 
                sm={{offset:1,span:5}}
                md={{offset:0,span:3}} 
                lg={{offset:0,span:3}} 
                xl={{offset:0,span:2}}
                >
                    Status: {status}
                </Col>
            </Row> 
                <Board 
                onClick={(i,e)=>squareClickHandler(i,e)}
                squares = {current.squares}
                meta={winnerChecker(current.squares)?winnerChecker(current.squares).meta:null}
                />
            <Row className="game-info justify-content-sm-center"> 
                <Col
                xs={{span:3}}
                sm={{span:1}}
                md={{span:1}} 
                lg={{span:1}} 
                xl={{span:1}}>
                    <span>Score:</span>
                </Col>
                <Col
                xs={{span:2}}
                sm={{span:2}}
                md={{span:1}} 
                lg={{span:1}} 
                xl={{span:1}}>
                    <span>X: {'\n'} {scoreKeeper.winnerScore.X}</span></Col>
                <Col
                xs={{span:2}}
                sm={{span:2}}
                md={{span:1}} 
                lg={{span:1}} 
                xl={{span:1}}>
                    <span>O: {'\n'} {scoreKeeper.winnerScore.O}</span>
                </Col>
            </Row>
            <Row className="">
                <Col
                xs={{offset:1,span:1}}
                sm={{offset:4,span:1}}
                md={{offset:5,span:1}}
                lg={{offset:5,span:1}} 
                xl={{offset:5,span:1}}
                >
                    <ButtonGroup className="mr-2">
                        <Button onClick={(e)=>goBackHandler(e)}  className={["control-back"].join(" ")}>Back</Button>
                        <Button onClick={(e)=>newBoardHandler(e)}  className={[ "control-new-board"].join(" ")}>New Board</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
        
    );
}

const winnerChecker=(squares)=>{
    const list = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]

    let i =0
    for(i; i<8;i++){
        const [a,b,c]=list[i];
        if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
            return {winner:squares[a],meta:i};
        }
    }
    //check for draw 
    if(!squares.includes(null)){
        return {winner:'XO',meta:11};
    }
    return null;
}

  // ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);  