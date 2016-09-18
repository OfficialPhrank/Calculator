import React, {Component} from 'react';

const Calculator = (props) => (
  <div className="s3 column">
    <div className="s1 row">
      <button className="button s1" data-code="49" value="1" onClick={props.onClick}>1</button>
      <button className="button s1" data-code="50" value="2" onClick={props.onClick}>2</button>
      <button className="button s1" data-code="51" value="3" onClick={props.onClick}>3</button>
      <button className="button s1" data-code="189" value="-" onClick={props.onClick}>-</button>
      <button className="button s1" data-code="shift+187" value="+" onClick={props.onClick}>+</button>
    </div>
    <div className="s1 row">
      <button className="button s1" data-code="52" value="4" onClick={props.onClick}>4</button>
      <button className="button s1" data-code="53" value="5" onClick={props.onClick}>5</button>
      <button className="button s1" data-code="54" value="6" onClick={props.onClick}>6</button>
      <button className="button s1" data-code="shift+56" value="*" onClick={props.onClick}>×</button>
      <button className="button s1" data-code="191" value="/" onClick={props.onClick}>÷</button>
    </div>
    <div className="s1 row">
      <button className="button s1" data-code="55" value="7" onClick={props.onClick}>7</button>
      <button className="button s1" data-code="56" value="8" onClick={props.onClick}>8</button>
      <button className="button s1" data-code="57" value="9" onClick={props.onClick}>9</button>
      <button className="button s1" data-code="shift+57" value="(" onClick={props.onClick}>(</button>
      <button className="button s1" data-code="shift+48" value=")" onClick={props.onClick}>)</button>
    </div>
    <div className="s1 row">
      <button className="button s2" data-code="48" value="0" onClick={props.onClick}>0</button>
      <button className="button s1" data-code="190" value="." onClick={props.onClick}>.</button>
      <button className="button s2 button-equal" data-code="13" value="=" onClick={props.equate}>=</button>
      <button className="button s1" data-code="46" onClick={props.clear}>C</button>
      <button className="button s1" data-code="8" onClick={props.delete}>←</button>
    </div>
  </div>
)

export default Calculator;
