import { useState } from 'react'

const Header = (props) => <div><h1>{props.text}</h1></div>

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const Statistics = ({ good, neutral, bad}) => {
  
  const all = good + neutral + bad

  if (all === 0) { 
    return <div>no feedback given</div>
  }

  const average = ((good - bad) / all).toFixed(1)
  const positive = (good / all * 100).toFixed(1) + ' %'
  

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value ={good} />
          <StatisticLine text="neutral" value ={neutral} />
          <StatisticLine text="bad" value ={bad} />
          <StatisticLine text="all" value ={all} />
          <StatisticLine text="average" value ={average} />
          <StatisticLine text="positive" value ={positive} />
        </tbody>  
      </table>
    </div>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr> 
      <td> {text} </td>
      <td> {value} </td>  
    </tr>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback" />
      <div>
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />
      </div>
      <div><h2> statistics </h2></div>
      <Statistics good={good} neutral={neutral} bad={bad} />
      
    </div>
  )
}

export default App
