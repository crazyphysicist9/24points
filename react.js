import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// class to generate number buttons
class Numbers extends React.Component {
  constructor(props) {
    super(props); 
    // set a state to record if the number has been used (if the button got clicked)
    this.state = {
      isClicked: false
    }
  }

  render () {
    return (
      <button 
        className="square" 
        onClick={ () => {
          if (this.state.isClicked) {
            alert ("Each number can only be used once.");
            return; 
          }
          else{
            this.setState({isClicked: true});
            this.props.onClick; // This is the line causing the error
          }
        }} 
        // style=this.state.isClicked ? 'background-color: #e7e7e7':'background-color: white'
      >
        {this.props.value}
      </button>
    )
  }
} 

function Operators(props) {
  /*** 
   * the following commented part is first version where operators values are assigned inside Ope class; changed to be assigned in father class (Board)
   * */  
  // const operators = ['+', '-', 'X', '/', '(', ')'];
 

  return (
    <button 
      className="square" 
      onClick = {props.onClick}
    >
      {props.value}
    </button>
  )

}

function Display(props) {
  return (
    <p>{props.input}</p>
  )
}

function Feedback(props) {
  return (
    <p>test</p>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      // numbers: Array(4).fill(null), //TODO: enable when random numbers ready
      numbers: ['24','2','3','5'],
      operators: ['+', '-', '*', '/', '(', ')'], 
      input: 'Your calculation: ',
    };
  }

  //function to tell if the output = 24
  isFinished(input){
    //filter the input
    // TODO: regular expression 
    if (eval(input) == 24) {
      return true; 
    }
    else {
      return false;
    }
  }

  // the function to handle Numbers clicked 
  handleNumber(i){
    // this.state.input = this.state.input + this.state.numbers[i];
    this.setState({
      input: this.state.input + this.state.numbers[i]
    })
    alert(this.state.numbers[i]);
    if(this.isFinished(this.state.input)){
      alert("finished");
      // TODO: start a new round here
    } 
  }

  // function to handle Operators clicked
  handleOperator(i){
    // this.state.input = this.state.input + this.state.operators[i];
    alert(this.state.operators[i]);
    this.setState({
      input: this.state.input + this.state.operators[i]
    })

    if(this.isFinished(this.state.input)){
      alert("finished");
      // TODO: start a new round here
    } 
  }


  // function to render Numbers 
  renderNumbers(i) {
    return (
      <Numbers 
        value = {this.state.numbers[i]}
        onClick = { () => this.handleNumber(i)} 
      />
    );
  }

  // function to render Operators
  renderOperators(i) {
    return (
      <Operators 
        value = {this.state.operators[i]}
        onClick = { () => this.handleOperator(i)} 
      />
    );
  }

  // main render function
  render() {
    const input = this.state.input;

    return (
      <div>
        <div className="board-row">
          {this.renderNumbers(0)}
          {this.renderNumbers(1)}
          {this.renderNumbers(2)}
          {this.renderNumbers(3)}
        </div>
        <div className="board-row">
          {this.renderOperators(0)}
          {this.renderOperators(1)}
          {this.renderOperators(2)}
          {this.renderOperators(3)}
          {this.renderOperators(4)}
          {this.renderOperators(5)}
        </div>
        <div >
          {input}
        </div>
      </div>
    )
  }
}

class Timer extends React.Component {
  render() {
    return (
      <p>timer test</p>
    )
  }
}

class Title extends React.Component {
  render() {
    return (
      <p>title test</p>
    )
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-title">
          <Title />
        </div>
        <div className="game-timer">
          <Timer />
        </div>
        <div className="game-board">
          <Board /**TODO: random numbers needed here *//> 
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')

// );