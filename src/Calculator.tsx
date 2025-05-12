import { useState, type KeyboardEvent } from 'react'
import Header from './Header'

interface MemoryOperation {
  isAdd?: boolean
  isRead?: boolean
  isClear?: boolean
}

export default function Calculator() {
  const [screen, setScreen] = useState<string>('0') // the screen display value
  const [firstNum, setFirstNum] = useState<string>('')
  const [currentOperand, setCurrentOperand] = useState<string>('')

  // Display clicked or pressed number
  const handleNumber = (number: string) => {
    if (screen === '0') {
      setScreen(number)
    } else if (screen.length <= 10) {
      setScreen((prev) => prev + number)
    }
  }

  // Update clicked or pressed operand
  const handleOperand = (operand: string) => {
    let newFirstNum = screen

    // check if chaining operations, i.e. 2 + 2 + 2, combine by calculating
    if (firstNum) {
      newFirstNum = handleCalculate(firstNum, screen)
    }

    setCurrentOperand(operand) // update operand to use
    setFirstNum(newFirstNum) // save current value to calculate
    setScreen('') // prep screen for next value
  }

  const handleNegative = () => {
    const currentValue = parseFloat(screen)

    if (isNaN(currentValue)) {
      return
    } // ensure negative can be applied to current value

    setScreen((currentValue * -1).toString()) // multipy by -1 to switch positive/negative
  }

  const handlePercent = () => {
    const currentValue = parseFloat(screen)

    if (isNaN(currentValue)) {
      return
    } // ensure percent can be applied to current value

    if (firstNum && currentOperand) {
      // handle as percentage of first number in operations like 100 + 10% => 100 + 10
      const baseValue = parseFloat(firstNum)
      const percentValue = (baseValue * currentValue) / 100
      setScreen(percentValue.toString())
    } else {
      // simple percentage conversion, i.e. 10% => 0.1
      const percentValue = currentValue / 100
      setScreen(percentValue.toString())
    }
  }

  const handleDecimal = () => {
    if (screen.includes('.')) {
      return // prevent infinite decimals
    } else if (screen === '') {
      setScreen('0.') // format decimal correctly
    } else {
      setScreen((prev) => prev + '.')
    }
  }

  // Calculate result of two numbers and update the screen
  const handleCalculate = (firstValue: string, currentValue: string) => {
    // error handling for odd inputs
    if (firstValue && !currentValue) {
      setScreen(firstValue)
      setFirstNum('')
      return firstValue
    } else if (!firstValue && currentValue) {
      return currentValue
    }

    // clean expected string props to ensure math is correct
    const num1 = parseFloat(firstValue) // use parseFloat to handle decimals
    const num2 = parseFloat(currentValue)
    let result = 0

    switch (currentOperand) {
      case '+':
        result = num1 + num2
        break
      case '-':
        result = num1 - num2
        break
      case 'x':
        result = num1 * num2
        break
      case '/':
        result = num1 / num2
        break
    }

    // .toFixed(10) to remove trailing zeros, calculate decimals without screen overflow
    const formattedResult = parseFloat(result.toFixed(10)).toString()

    setFirstNum('')
    setScreen(formattedResult)

    return formattedResult
  }

  const handleClear = () => {
    setFirstNum('')
    setCurrentOperand('')
    setScreen('0')
  }

  // Add or subtract from memory
  const handleMemory = ({ isAdd, isRead, isClear }: MemoryOperation) => {
    const memoryValue = parseFloat(localStorage.getItem('memoryValue') || '0')

    if (isRead) {
      setScreen(memoryValue.toString())
      return
    }

    if (isClear) {
      localStorage.setItem('memoryValue', '0')
      return
    }

    const currentValue = parseFloat(screen)
    const result = isAdd
      ? memoryValue + currentValue
      : memoryValue - currentValue
    localStorage.setItem('memoryValue', result.toString())
  }

  // Keyboard controls
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key.toLowerCase()
    const isNumber = /^[0-9]$/i.test(key) // check if pressed key is a valid number
    const availableOperands = ['+', '-', '/', 'x']

    if (isNumber) {
      handleNumber(key)
    } else if (availableOperands.includes(key)) {
      handleOperand(key)
    } else if (key === 'enter') {
      handleCalculate(firstNum, screen)
    } else if (key === 'c' || key === 'backspace') {
      handleClear()
    } else if (key === '!') {
      handleNegative()
    } else if (key === '.') {
      handleDecimal()
    }
  }

  return (
    <div className='container' onKeyUp={handleKeyUp} tabIndex={0}>
      <Header />
      <div className='calculator'>
        <input disabled value={screen} />
        <div className='grid'>
          <button onClick={() => handleMemory({ isClear: true })}>mc</button>
          <button onClick={() => handleMemory({ isAdd: true })}>m+</button>
          <button onClick={() => handleMemory({ isAdd: false })}>m-</button>
          <button onClick={() => handleMemory({ isRead: true })}>mr</button>

          <button className='button-primary' onClick={handleClear}>
            ac
          </button>
          <button className='operand' onClick={handleNegative}>
            +/-
          </button>
          <button className='operand' onClick={handlePercent}>
            %
          </button>
          <button className='operand' onClick={() => handleOperand('/')}>
            /
          </button>

          <button onClick={() => handleNumber('7')}>7</button>
          <button onClick={() => handleNumber('8')}>8</button>
          <button onClick={() => handleNumber('9')}>9</button>
          <button className='operand' onClick={() => handleOperand('x')}>
            x
          </button>

          <button onClick={() => handleNumber('4')}>4</button>
          <button onClick={() => handleNumber('5')}>5</button>
          <button onClick={() => handleNumber('6')}>6</button>
          <button className='operand' onClick={() => handleOperand('-')}>
            -
          </button>

          <button onClick={() => handleNumber('1')}>1</button>
          <button onClick={() => handleNumber('2')}>2</button>
          <button onClick={() => handleNumber('3')}>3</button>
          <button className='operand' onClick={() => handleOperand('+')}>
            +
          </button>

          <button onClick={() => handleNumber('0')}>0</button>
          <button onClick={handleDecimal}>.</button>
          <button
            className='button-primary wide'
            onClick={() => handleCalculate(firstNum, screen)}
          >
            =
          </button>
        </div>
      </div>
    </div>
  )
}
