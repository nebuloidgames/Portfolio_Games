import React from "react";
import Card from "./Card";
import { DIFFICULTY_CONFIG } from "../utils/createCards";

const GameBoard = ({
  cards,
  flippedCards,
  matchedCards,
  onCardClick,
  disabled,
  difficulty,
}) => {
  const columns = DIFFICULTY_CONFIG[difficulty]?.columns || 4;

  return (
    <div
      className="grid gap-2 sm:gap-2.5 md:gap-3 w-full"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          isFlipped={flippedCards.includes(card.id)}
          isMatched={matchedCards.includes(card.id)}
          onClick={onCardClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default React.memo(GameBoard);
