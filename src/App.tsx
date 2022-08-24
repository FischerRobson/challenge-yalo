import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { api } from "./utils/api";
import { CARD_VALUES, SUITES, SUITES_PROTO } from "./utils/values";
import backCardImg from "./assets/images/back-card.png";

interface ApiResponse {
  deck_id: string;
}

interface Card {
  code: string;
  image: string;
  suit: string;
  value: string;
}

interface Player {
  name: string;
  score: number;
}

function App() {
  const [deckId, setDeckId] = useState<null | string>(null);

  const [player1, setPlayer1] = useState<Player>({ name: "p1", score: 0 });
  const [player2, setPlayer2] = useState<Player>({ name: "p2", score: 0 });

  const [card, setCard] = useState<null | Card>(null);

  const [itsPlayer1Turn, setItsPlayer1Turn] = useState(true);

  const [selectedValue, setSelectedValue] = useState("");
  const [selectedSuit, setSelectedSuit] = useState("");

  const [turnCount, setTurnCount] = useState(1);

  const [endGame, setEndGame] = useState(false);

  useEffect(() => {
    getDeckId();
  }, []);

  useEffect(() => {
    if (turnCount > 10) setEndGame(true);
  }, [turnCount]);

  async function getDeckId() {
    const response = await api.get<ApiResponse>(
      "api/deck/new/shuffle/?deck_count=1"
    );
    const { deck_id } = response.data;
    setDeckId(deck_id);
  }

  async function getNewCard() {
    const resp = await api.get(`api/deck/${deckId}/draw/?count=1`);
    const { cards } = resp.data;

    const card = cards[0];
    setCard(card);
    await reshuffle();
    return card;
  }

  async function reshuffle() {
    await api.get(`api/deck/${deckId}/shuffle?remaining=true`);
  }

  function changeTurn() {
    setSelectedSuit("");
    setSelectedValue("");

    const isP1Time = itsPlayer1Turn;

    setItsPlayer1Turn(!isP1Time);
    if (!isP1Time) setTurnCount(turnCount + 1);
  }

  function updateScore(score: number) {
    if (itsPlayer1Turn) {
      setPlayer1({ ...player1, score: player1.score + score });
    } else {
      setPlayer2({ ...player2, score: player2.score + score });
    }
  }

  async function submitCard() {
    if (!selectedSuit || !selectedValue) return;

    const scopedCard = await getNewCard();

    let roundPoint = 0;

    if (scopedCard?.value === selectedValue) {
      roundPoint += 3;
    }

    if (scopedCard?.suit === selectedSuit) {
      roundPoint += 1;
    }

    if (
      scopedCard?.suit === selectedSuit &&
      scopedCard?.value === selectedValue
    ) {
      roundPoint = 5;
    }

    updateScore(roundPoint);

    await reshuffle();
    changeTurn();
  }

  function getWinner() {
    if (player1.score > player2.score) {
      return "Player 1";
    } else if (player2.score > player1.score) {
      return "Player 2";
    } else return "DRAW";
  }

  return (
    <div className="h-[100vh]  bg-dracula-bg">
      <main className="max-w-[1360px] mx-auto flex flex-col">
        <header className="flex flex-col justify-center items-center">
          <h1 className="my-4 text-2xl text-dracula-white">CARDS GUESSER</h1>

          <h2 className="text-dracula-white ">
            Turn {turnCount}: {itsPlayer1Turn ? "Player 1" : "Player 2"}
          </h2>

          <section className="mt-2 flex flex-col items-center">
            <h3 className="text-dracula-green">Player1 : {player1.score}</h3>
            <h3 className="text-dracula-red">Player2 : {player2.score}</h3>
          </section>
        </header>

        {/* {card ? (
          <img src={card?.image} alt="card" />
        ) : (
          <img className="w-96" src={backCardImg} alt="card" />
        )} */}

        <div
          className={`mt-2 flex justify-center flex-col items-center ${
            itsPlayer1Turn ? "text-dracula-green" : "text-dracula-red"
          }`}
        >
          <h3> SELECTED VALUE: {selectedValue}</h3>
          <h3> SELECTED SUIT: {selectedSuit}</h3>
        </div>

        <section className="mt-2 flex justify-center">
          <img className="w-96" src={backCardImg} alt="card" />
        </section>

        <div className="mt-6 flex justify-center gap-2">
          {CARD_VALUES.map((card) => {
            return (
              <Button
                className={`${
                  itsPlayer1Turn ? "bg-dracula-green" : "bg-dracula-red"
                } ${selectedValue === card && "opacity-20"}`}
                key={card}
                onClick={() => setSelectedValue(card)}
              >
                {card}
              </Button>
            );
          })}
        </div>

        <div className="mt-2 flex justify-center gap-2">
          {SUITES.map((suit) => {
            return (
              <Button
                className={`${
                  itsPlayer1Turn ? "bg-dracula-green" : "bg-dracula-red"
                } ${selectedSuit === suit && "opacity-20"}`}
                key={SUITES_PROTO[suit].value}
                onClick={() => setSelectedSuit(suit)}
              >
                {SUITES_PROTO[suit].image}
              </Button>
            );
          })}
        </div>

        <footer className="flex justify-center">
          <Button
            className="bg-dracula-white text-dracula-bg mt-6 max-w-xs"
            onClick={submitCard}
          >
            Submit card
          </Button>
        </footer>

        {endGame && <h1>GAME OVER, WINNER: {getWinner()}</h1>}
      </main>
    </div>
  );
}

export default App;
