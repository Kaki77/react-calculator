import './App.css';
import { useReducer, useEffect } from 'react';

const ACTIONS={
  ADD_DIGIT:'ADD_DIGIT',
  REMOVE_DIGIT:'REMOVE_DIGIT',
  OPERATOR:'OPERATOR',
  CALCULATE:'CALCULATE',
  RESET:'RESET'
}

const KEYS={
  DIGIT:['0','1','2','3','4','5','6','7','8','9','.'],
  OPERATOR:['+','-','*','/'],
  EQUAL:['Enter'],
  RESET:['Delete'],
  DEL:['Backspace']
}

function reducer(state,{type,payload}){
  switch(type){

    case ACTIONS.ADD_DIGIT:
      if(state.operator===null)
      {
        return {...state,currentNumber:payload.digit,operator:''}
      }
      if(state.currentNumber==='0' && payload.digit==='0')
      {
        return state
      }
      if(state.currentNumber){
        if(payload.digit==="." && state.currentNumber.includes('.'))
        {
          return state
        }
      }
      return {...state,currentNumber:`${state.currentNumber||""}${payload.digit}`}
    
    case ACTIONS.REMOVE_DIGIT:
      if(!state.currentNumber)
      {
        return state
      }
      return {...state,currentNumber:state.currentNumber.slice(0,state.currentNumber.length-1)}

    case ACTIONS.OPERATOR:
      if(payload.digit==="-" && !state.currentNumber)
      {
        return {...state,currentNumber:payload.digit}
      }
      if((!state.previousNumber && !state.currentNumber) || state.currentNumber==='Error' || state.currentNumber==="." || state.currentNumber==='-')
      {
        return state
      }
      if(!state.currentNumber){
        return {...state,operator:payload.digit}
      }
      if(!state.previousNumber)
      {
        return {...state,previousNumber:`${state.currentNumber}`,currentNumber:'',operator:payload.digit}
      }
      return {...state,previousNumber:compute(state),currentNumber:"",operator:payload.digit}
    
    case ACTIONS.CALCULATE:
      if(!state.currentNumber || !state.previousNumber || state.currentNumber===".")
      {
        return state
      }
      return {...state,currentNumber:compute(state),previousNumber:'',operator:null}
    
    case ACTIONS.RESET:
      return {}

    default:
      return state
  }
}

function compute(state){
  let left_number
  let right_number
  if(state.previousNumber.includes('.'))
  {
    left_number=parseFloat(state.previousNumber)
  }
  else
  {
    left_number=parseInt(state.previousNumber)
  }
  if(state.currentNumber.includes('.'))
  {
    right_number=parseFloat(state.currentNumber)
  }
  else
  {
    right_number=parseInt(state.currentNumber)
  }
  switch(state.operator)
  {
    case '+':
      return (left_number+right_number).toString()
    case '-':
      return (left_number-right_number).toString()
    case '*':
      return (left_number*right_number).toString()
    case '/':
      if(right_number===0)
      {
        return "Error"
      }
      return (parseFloat(left_number/right_number)).toString()
    default:
      return state
  }
}

function App() {
  const [{previousNumber,currentNumber,operator},dispatch]=useReducer(reducer,{})
  useEffect(()=>{
    document.addEventListener('keydown',handleKeyPressed)
    document.addEventListener('keyup',(event)=>{if(document.getElementById("key_"+event.key)){document.getElementById("key_"+event.key).firstChild.classList.remove('active')}})
    return()=>{
      document.removeEventListener('keydown',handleKeyPressed)
      document.removeEventListener('keyup',(event)=>document.getElementById("key_"+event.code).firstChild.classList.remove('active'))
    }
  },[])
  useEffect(()=>{
    let buttons=Array.from(document.getElementsByTagName('button'))
    for(let i=0;i<buttons.length;i++){
      buttons[i].onmousedown=function(event){
        event.target.classList.toggle('active')
      }
      buttons[i].onmouseup=function(event){
        event.target.classList.toggle('active')
      }
    }
  })
  function handleKeyPressed(event){
    if(KEYS.DIGIT.includes(event.key))
    {
      dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:event.key}})
    }
    else if(KEYS.OPERATOR.includes(event.key)){
      dispatch({type:ACTIONS.OPERATOR,payload:{digit:event.key}})
    }
    else if(KEYS.EQUAL.includes(event.key)){
      dispatch({type:ACTIONS.CALCULATE})
    }
    else if(KEYS.RESET.includes(event.key)){
      dispatch({type:ACTIONS.RESET})
    }
    else if(KEYS.DEL.includes(event.key)){
      dispatch({type:ACTIONS.REMOVE_DIGIT})
    }
    else{
      return
    }
    document.getElementById("key_"+event.key).firstChild.classList.add('active')
  }

  return (
    <div id="calculator">
      <div id="screen">
        <div id="top-screen">{previousNumber}{operator}</div>
        <div id="bottom-screen">{currentNumber}</div>
      </div>
      <div id="key_Delete" onClick={()=>dispatch({type:ACTIONS.RESET})}><button>AC</button></div>
      <div id="key_Backspace" onClick={()=>dispatch({type:ACTIONS.REMOVE_DIGIT})}><button>DEL</button></div>
      <div id="key_/" onClick={()=>dispatch({type:ACTIONS.OPERATOR,payload:{digit:'/'}})}><button>/</button></div>
      <div id="key_*" onClick={()=>dispatch({type:ACTIONS.OPERATOR,payload:{digit:'*'}})}><button>X</button></div>
      <div id="key_7" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'7'}})}><button>7</button></div>
      <div id="key_8" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'8'}})}><button>8</button></div>
      <div id="key_9" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'9'}})}><button>9</button></div>
      <div id="key_-" onClick={()=>dispatch({type:ACTIONS.OPERATOR,payload:{digit:'-'}})}><button>-</button></div>
      <div id="key_4" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'4'}})}><button>4</button></div>
      <div id="key_5" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'5'}})}><button>5</button></div>
      <div id="key_6" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'6'}})}><button>6</button></div>
      <div id="key_+" onClick={()=>dispatch({type:ACTIONS.OPERATOR,payload:{digit:'+'}})}><button>+</button></div>
      <div id="key_1" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'1'}})}><button>1</button></div>
      <div id="key_2" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'2'}})}><button>2</button></div>
      <div id="key_3" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'3'}})}><button>3</button></div>
      <div id="key_Enter" onClick={()=>dispatch({type:ACTIONS.CALCULATE,payload:{digit:'='}})}><button>=</button></div>
      <div id="key_0" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'0'}})}><button>0</button></div>
      <div id="key_." onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'.'}})}><button>.</button></div>
    </div>
  );
}

export default App;
