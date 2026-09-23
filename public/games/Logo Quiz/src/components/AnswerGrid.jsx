import React from 'react';
import AnswerButton from './AnswerButton';

const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Answer Grid layout component
 */
export default function AnswerGrid({
  options = [],
  correctAnswer = '',
  selectedAnswer = null,
  isAnswered = false,
  eliminatedOptions = [],
  onSelectOption,
}) {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 w-full max-w-xl mx-auto">
      {options.map((option, index) => {
        let status = 'idle';

        if (eliminatedOptions.includes(option)) {
          status = 'eliminated';
        } else if (isAnswered) {
          if (option === correctAnswer) {
            status = 'correct';
          } else if (option === selectedAnswer) {
            status = 'wrong';
          }
        } else if (option === selectedAnswer) {
          status = 'selected';
        }

        return (
          <AnswerButton
            key={option}
            letter={LETTERS[index] || String.fromCharCode(65 + index)}
            label={option}
            index={index}
            status={status}
            disabled={isAnswered}
            onClick={() => onSelectOption(option)}
          />
        );
      })}
    </div>
  );
}
