import { useEffect, useState } from "react"
import { api } from "./utils/api";
import { CARD_VALUES, SUITES } from './utils/values';

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

  const [player1, setPlayer1] = useState<Player>({ name: 'p1', score: 0 });
  const [player2, setPlayer2] = useState<Player>({ name: 'p2', score: 0 });

  const [card, setCard] = useState<null | Card>(null);

  const [itsPlayer1Turn, setItsPlayer1Turn] = useState(true);

  const [selectedValue, setSelectedValue] = useState('');
  const [selectedSuit, setSelectedSuit] = useState('');

  const [turnCount, setTurnCount] = useState(1);

  const [endGame, setEndGame] = useState(false);

  useEffect(() => {
    getDeckId();
  }, []);

  useEffect(() => {
    if (turnCount > 10) setEndGame(true);
  }, [turnCount]);

  async function getDeckId() {
    const response = await api.get<ApiResponse>('api/deck/new/shuffle/?deck_count=1');
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
    setSelectedSuit('');
    setSelectedValue('');

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

    if (scopedCard?.suit === selectedSuit && scopedCard?.value === selectedValue) {
      roundPoint = 5;
    }

    updateScore(roundPoint);

    await reshuffle();
    changeTurn();
  }

  function getWinner() {
    if (player1.score > player2.score) {
      return 'Player 1'
    } else if (player2.score > player1.score) {
      return 'Player 2';
    } else return 'DRAW';
  }

  return (
    <div>
      <img src={card?.image} alt='card' /><br />
      <h1>Turn {turnCount}: {itsPlayer1Turn ? 'Player 1' : 'Player 2'}</h1>

      <h3>Player1 : {player1.score}</h3>
      <h3>Player2 : {player2.score}</h3>

      <div>
        {CARD_VALUES.map(card => {
          return (
            <button key={card} onClick={() => setSelectedValue(card)} >{card}</button>
          )
        })}
        {" "}selected: {selectedValue}
      </div><br />

      <div>
        {SUITES.map(suit => {
          return (
            <button key={suit} onClick={() => setSelectedSuit(suit)} >{suit}</button>
          )
        })}
        {" "}selected: {selectedSuit}
      </div><br />

      <button onClick={submitCard} >Submit card</button><br />

      {endGame && (<h1>GAME OVER, WINNER: {getWinner()}</h1>)}
    </div >
  )
}

export default App
