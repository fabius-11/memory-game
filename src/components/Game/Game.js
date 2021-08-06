import React, { useState, useEffect } from "react";
import { shuffle } from "lodash-es";
import "./Game.scss";
import Card from "../Card/Card";
import StartGame from "../StartGame/StartGame";
import Score from "../Score/Score";

export default function Game() {
  const [allCards, setAllCards] = useState([]); // todas las cartas
  const [chosenCards, setChosenCards] = useState([]); // para elegir cartas de forma ramdomnizada
  const [flippedCards, setFlippedCards] = useState([]); // las cartas que elegimos
  const [doneCards, setDoneCards] = useState([]); // para las cartas que recordamos bien y matchean
  const [score, setScore] = useState(0); // puntaje

  useEffect(() => {
    fetchAvatars();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setTimeout(() => {
        accessFlipped("normal");
      }, 700);

      setTimeout(() => {
        accessFlipped("clear");
      }, 1000);
    }
  });

  function createRandomCards(numberOfCards = 10, cards) {
    setScore(0); // puntaje en 0
    let random = 0;
    let randomCards = [];
    for (let i = 0; i < numberOfCards; i++) {
      random = Math.floor(Math.random() * cards.length);
      randomCards.push({
        image: cards[random],
        id: i,
        flipped: false,
        done: false,
      }); // cuando hacemos click flipped se convierte en verdad
      randomCards.push({
        image: cards[random],
        id: numberOfCards + i,
        flipped: false,
        done: false,
      }); // cuando las cartas hacen match done se convierte en verdad
    }
    randomCards = shuffle(randomCards); // barajamos de forma ramdomnizado
    setChosenCards(randomCards);
  }

  // traemos las imagenes
  function fetchAvatars() {
    fetch("https://api.github.com/repos/facebook/react/contributors?")
      .then((reponse) => reponse.json())
      .then((data) => {
        const avatars = data.map((data) => {
          return data.avatar_url;
        });
        setAllCards(avatars);
      }, console.error);
  }

  function accessFlipped(option = "normal") {
    setTimeout(() => {
      if (
        option === "normal" &&
        flippedCards[0].image === flippedCards[1].image &&
        flippedCards[0].id !== flippedCards[1].id
      ) {
        flippedCards[0].done = true;
        flippedCards[1].done = true;
        setDoneCards((doneCards) => [...doneCards, flippedCards]);
        setScore(score + 10);
      }
    }, 1000);

    if (option === "clear") {
      flippedCards.map((card) => {
        return (card.flipped = false);
      });
      setFlippedCards((flippedCards) => []);
    }
  }

  function clickHandler(card) {
    if (flippedCards.length < 2 && card.done === false) {
      card.flipped = true;
      setFlippedCards((flippedCards) => [...flippedCards, card]);
    }
  }

  function getScore() {
    return score;
  }

  return (
    <div className="game-container">
      <StartGame
        onClick={() => createRandomCards(12, allCards)}
        innerHTML={`Empezar el juego`}
      />
      <div className="cards-container">
        {chosenCards.map((card) => {
          return (
            <Card
              image={card.image}
              flipped={card.flipped}
              done={card.done}
              onClick={() => clickHandler(card)}
            />
          );
        })}
      </div>
      <IsGameEnd
        doneCards={doneCards}
        chosenCards={chosenCards}
        score={score}
      />
      <Score getScore={getScore} />
    </div>
  );
}

const IsGameEnd = (props) => {
  const { doneCards, chosenCards } = props;
  if (doneCards.length * 2 === chosenCards.length && doneCards.length > 0) {
    return <h1 className="game-end">Felicidades!</h1>;
  }
  return <></>;
};
