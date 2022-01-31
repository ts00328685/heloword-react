import { useReducer } from 'react';
import './App.css';
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';

export const ACTIONS = {
  DIGIT: 'ADD_DIGIT',
  OPERATION: 'OPERATION',
  CLEAR: 'CLEAR',
  DELETE: 'DELETE',
  EVALUATE: 'EVALUATE'
}

function reducer(state = {}, { type, payload }) {
  switch (type) {

    case ACTIONS.DIGIT:

      if (state.currentOperand === '0' && payload.digit === '0') {
        return state;
      }

      if (payload.digit === '.' && (state.currentOperand + '').includes('.')) {
        return state;
      }

      if (state.currentOperand === '0') {
        return {
          ...state,
          currentOperand: payload.digit
        };
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }

    case ACTIONS.OPERATION:
      if (!state.currentOperand && !state.previousOperand) {
        return state;
      }
      if (state.previousOperand && !state.currentOperand) {
        return state;
      }
      if (!state.previousOperand) {
        return {
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: ''
        }
      }
      return {
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: ''
      }

    case ACTIONS.DELETE: {
      if (!state.currentOperand) {
        return state;
      }
      const sub = (state.currentOperand >= 10 ? state.currentOperand / 10 : 0).toFixed(0);
      return {
        ...state,
        currentOperand: sub
      };
    }

    case ACTIONS.EVALUATE: {
      if (!state.currentOperand || !state.previousOperand) {
        return state;
      }
      return {
        previousOperand: '',
        currentOperand: evaluate(state),
        operation: ''
      };
    }

    case ACTIONS.CLEAR: {
      return {};
    }


    default:
      return state;
  }
}

function evaluate({ previousOperand, currentOperand, operation }) {

  previousOperand = parseFloat(previousOperand);
  currentOperand = parseFloat(currentOperand);

  switch (operation) {
    case '+':
      return previousOperand + currentOperand
    case '-':
      return previousOperand - currentOperand
    case '*':
      return previousOperand * currentOperand
    case '/':
      return previousOperand / currentOperand
    default:
      return '';
  }
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{previousOperand} {operation}</div>
        <div className='current-operand'>{currentOperand}</div>

      </div>

      <button onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: {} })} className='span-two'>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE, payload: {} })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} ></OperationButton>

      <DigitButton digit="1" dispatch={dispatch} ></DigitButton>
      <DigitButton digit="2" dispatch={dispatch} ></DigitButton>
      <DigitButton digit="3" dispatch={dispatch} ></DigitButton>
      <OperationButton operation="*" dispatch={dispatch} ></OperationButton>

      <DigitButton digit="4" dispatch={dispatch} ></DigitButton>
      <DigitButton digit="5" dispatch={dispatch} ></DigitButton>
      <DigitButton digit="6" dispatch={dispatch} ></DigitButton>
      <OperationButton operation="+" dispatch={dispatch} ></OperationButton>

      <DigitButton digit="7" dispatch={dispatch} ></DigitButton>
      <DigitButton digit="8" dispatch={dispatch} ></DigitButton>
      <DigitButton digit="9" dispatch={dispatch} ></DigitButton>
      <OperationButton operation="-" dispatch={dispatch} ></OperationButton>

      <DigitButton digit="." dispatch={dispatch} ></DigitButton>
      <DigitButton digit="0" dispatch={dispatch} ></DigitButton>
      <button onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: {} })} className='span-two'>=</button>

    </div >
  );
}

export default App;
