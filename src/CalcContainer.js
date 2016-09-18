import React, {Component} from 'react';
import Calculator from './Calculator';

// Constants used for the regex held in an array
const rePar = /\((.+?)\)/g;
const reMulDiv = /(\d+\.?\d*)([\*\/])(\d+\.?\d*)/g;
const reAddSub = /(\d+\.?\d*)([\+\-])(\d+\.?\d*)/g;
const reNum = /\d+\.?\d*/g;
const reError = /^\s*([-+]?)(\d+\.?\d*)(?:\s*([-+*\/])\s*((?:\s[-+])?\d+\.?\d*)\s*)+$/g;
const regEx = [rePar, reMulDiv, reAddSub];

export default class CalcContainer extends Component {
  constructor() {
    super();
    this.state = {
      defaultValue: true,
      result: null,
      keys: []
    };
    this.onClick = this.onClick.bind(this);
    this.equate = this.equate.bind(this);
    this.clear = this.clear.bind(this);
    this.delete =this.delete.bind(this);
  }

  // set button handlers
  componentDidMount() {
    let buttons = document.querySelectorAll('button');
    buttons = [].slice.call(buttons);
    buttons.forEach((button) => {
      this.state.keys[button.dataset.code] = button;
    });

    window.onkeydown = (event) => {
      let button;
      const key = (event.shiftKey ? 'shift+' : '') + event.keyCode || event.which;
      if (button = this.state.keys[key]) {
        button.click();
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  // check for 0, if it's there, append data. Otherwise replace it.
  onClick(e) {
    const re = /\d/g;
    const input = document.getElementById('calcInput');
    if (this.state.defaultValue === true && re.test(e.target.value)) {
      input.value = e.target.value;
      this.setState({
        defaultValue: false
      });
    } else {
      this.setState({
        defaultValue: false
      });
      input.value += e.target.value;
    }
  }

  // delete items from input until nothing is left and Clear is called
  delete(e) {
    const input = document.getElementById('calcInput');
    if (this.state.defaultValue === true) {
      return e;
    } else {
      input.value = input.value.slice(0, -1);
      if (input.value.length < 1) {
        this.clear();
      }
    }
  }

  // reset everything
  clear() {
    const input = document.getElementById('calcInput');
    this.setState({
      defaultValue: true,
      result: null
    });
    input.value = 0;
  }

/*
 * This loops over the equation in multiple iterations.
 * First checks for Parantheses. Then goes through those groups
 * and solves the problems and replaces the information.
 * Then does another passthrough looking for * / + - and calculates it.
 */

  equate() {
    const input = document.getElementById('calcInput');
    let equation = input.value;
    let result = null;

    function calculate(a, operand, b) {
      a = parseFloat(a);
      b = parseFloat(b);
      switch(operand) {
        case '*': return a*b; break;
        case '+': return a+b; break;
        case '/': return a/b; break;
        case '-': return a-b; break;
        default: null;
      }
    }

    // Loop over the equation and find matches
    matches:
  	for (let i=0, len=regEx.length; i<len; i++) {

    // stop at parentheses and process those results first
      parentheses:
    	while (regEx[0].test(equation)) {
        let matches = equation.match(regEx[0]);
        let brackets = equation.match(regEx[0]);

        // loop over groups of brackets
        groups:
        for (let j=0, len=matches.length; j<len; j++) {

          //stop at Multiplication + Division
          multdiv:
          while (regEx[1].test(matches[j])) {
            let group = matches[j].match(regEx[1]);

            // loop over groups of equations within bracket groups
            inner:
            for (let k=0, len = group.length; k<len; k++) {
              if (!regEx[1].test(matches[j])) break multdiv;
              let temp = group[k].split(regEx[1]);
              result = calculate(temp[1], temp[2], temp[3]);
              // nice error handling i found
              if (isNaN(result) || !isFinite(result)) return result;
              // group[k] = group[k].replace(regEx[1], result);
              matches[j] = matches[j].replace(group[k], result);
            }
          }
          // loop over groups of +-
          plusmin:
          while (regEx[2].test(matches[j])) {
            let group = matches[j].match(regEx[2]);
            // loop over groups of equations within bracket groups
            inner:
            for (let k=0, len = group.length; k<len; k++) {
              if (!regEx[2].test(matches[j])) break plusmin;
              let temp = group[k].split(regEx[2]);
              result = calculate(temp[1], temp[2], temp[3]);
              // nice error handling i found
              if (isNaN(result) || !isFinite(result)) return result;
              // group[k] = group[k].replace(regEx[1], result);
              matches[j] = matches[j].replace(group[k], result);
            }
          }
          equation = equation.replace(brackets[j], matches[j].match(reNum));
          if (j===matches.length-1
            && !regEx[1].test(matches[j])
            && !regEx[2].test(matches[j])) break parentheses;
        }
      }

      // loop through the other 2 regEx formulas
      others:
    	while (regEx[i].test(equation)) {
        let matches = equation.match(regEx[i]);
        let brackets = equation.match(regEx[i]);

        // loop over groups of */
          multdiv:
          while (regEx[1].test(matches)) {
            for (let j=0, len=matches.length; j<len; j++) {
              let group = matches[j].match(regEx[1]);
              if (!regEx[1].test(matches)) break multdiv;
              let temp = group[0].split(regEx[1]);
              result = calculate(temp[1], temp[2], temp[3]);
              // nice error handling i found
              if (isNaN(result) || !isFinite(result)) return result;
              // group[k] = group[k].replace(regEx[1], result);
              matches[j] = matches[j].replace(group[0], result);
              equation = equation.replace(group[0], matches[j]);
            }
          }
          // loop over groups of +-
          plusmin:
          while (regEx[2].test(matches)) {
            for (let j=0, len=matches.length; j<len; j++) {
              let group = matches[j].match(regEx[2]);
              if (!regEx[2].test(matches[j])) break plusmin;
              let temp = group[0].split(regEx[2]);
              result = calculate(temp[1], temp[2], temp[3]);
              // nice error handling i found
              if (isNaN(result) || !isFinite(result)) return result;
              // group[k] = group[k].replace(regEx[1], result);
              matches[j] = matches[j].replace(group[0], result);
              equation = equation.replace(group[0], matches[j]);
            }
          }
        if (i===regEx.length-1
          && !regEx[1].test(equation)
          && !regEx[2].test(equation)) break others;
      }
    }
    let error;
    if (isNaN(equation) || !isFinite(equation)) {
      error = "Something went wrong!"
      this.setState({
        result: error
      });
    } else {
      this.setState({
        result: equation
      });
    }
  }

  render() {
    return(
      <div>
        <input
          id="calcInput"
          defaultValue="0"
          onChange={this.onClick}
        />
        <p>{ this.state.result != null ? this.state.result : null }</p>
        <Calculator
          onClick={this.onClick}
          equate={this.equate}
          clear={this.clear}
          delete={this.delete}
        />
      </div>
    )
  }
