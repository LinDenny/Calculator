import React, { useState } from 'react';
import './Calculator.css';

interface DisplayProps {
  display: string;
}
// 抽离显示组件,方便后续扩展
const Display: React.FC<DisplayProps> = ({ display }) => {
  return (
    <div className="display">{display}</div>
  );
}

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [isCalculated, setCalculated] = useState<boolean>(false);

  function formatNumStr(numStr: string): string {
    return numStr.length > 1 ? numStr.replace(/^(-?)(0+)(\d+)/, '$1$3') : numStr; // 去掉重复的0
  }

  function formatStringExpression(expression: string) {
    // 提取操作数和运算符, 将每个数字格式化后再做运算
    const operands: string[] = expression.split(/[-+*/]/);
    const operator: string[] = expression.match(/[-+*/]/g) || [];
    return operands.reduce((result: string, current: string, index: number) => result += (formatNumStr(current) + (operator[index] || '')), '');

  }

  const handleButtonClick = (value: string): void => {
    if (isCalculated) {
      setCalculated(false);
      // 如果当前展示的是计算后的结果,当输入数字的时候直接展示成输入的值
      if (/[0-9]$/.test(value)) {
        setDisplay(value);
        return;
      }
    }
    if (/[0-9]$/.test(display) || !isNaN(Number(value))) {
      setDisplay((prevDisplay) => formatStringExpression(prevDisplay + value));
    }
    setCalculated(false);
  };

  const handleCalculate = (): void => {
    try {
      // eval是简单处理,后续可以使用专门的库,或者其他计算方法
      const result = eval(display);
      setDisplay(result.toString());
      setCalculated(true);
    } catch (error) {
      setDisplay('0');
      setCalculated(true);
    }
  };

  const handleClear = (): void => {
    setDisplay('0');
    setCalculated(false);
  };

  const handleDelete = (): void => {
    setDisplay((prevDisplay) => prevDisplay.slice(0, -1));
    setCalculated(false);
  };

  return (
    <div className="calculator">
      <Display display={display} />
      <div className="row">
        <button onClick={handleClear}>C</button>
        <button onClick={handleDelete}>DEL</button>
        <button onClick={() => handleButtonClick('/')}>/</button>
        <button onClick={() => handleButtonClick('*')}>*</button>
      </div>
      <div className="row">
        <button onClick={() => handleButtonClick('7')}>7</button>
        <button onClick={() => handleButtonClick('8')}>8</button>
        <button onClick={() => handleButtonClick('9')}>9</button>
        <button onClick={() => handleButtonClick('-')}>-</button>
      </div>
      <div className="row">
        <button onClick={() => handleButtonClick('4')}>4</button>
        <button onClick={() => handleButtonClick('5')}>5</button>
        <button onClick={() => handleButtonClick('6')}>6</button>
        <button onClick={() => handleButtonClick('+')}>+</button>
      </div>
      <div className="row">
        <button onClick={() => handleButtonClick('1')}>1</button>
        <button onClick={() => handleButtonClick('2')}>2</button>
        <button onClick={() => handleButtonClick('3')}>3</button>
        <button onClick={handleCalculate}>=</button>
      </div>
      <div className="row">
        <button onClick={() => handleButtonClick('0')}>0</button>
        <button onClick={() => handleButtonClick('.')}>.</button>
      </div>
    </div>
  );
};

export default Calculator;
