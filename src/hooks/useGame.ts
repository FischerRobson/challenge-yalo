import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../utils/api";

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

export function useGame() {
  const [deckId, setDeckId] = useState<null | string>(null);

  const [player1, setPlayer1] = useState<Player>({ name: "p1", score: 0 });
  const [player2, setPlayer2] = useState<Player>({ name: "p2", score: 0 });

  const [card, setCard] = useState<null | Card>(null);

  const [itsPlayer1Turn, setItsPlayer1Turn] = useState(true);

  const [selectedValue, setSelectedValue] = useState("");
  const [selectedSuit, setSelectedSuit] = useState("");

  const [turnCount, setTurnCount] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getDeckId();
  }, []);

  useEffect(() => {
    if (turnCount > 10) getWinner();
  }, [getWinner, turnCount]);

  const getDeckId = useCallback(async () => {
    const response = await api.get<ApiResponse>(
      "api/deck/new/shuffle/?deck_count=1"
    );
    // eslint-disable-next-line camelcase
    const { deck_id } = response.data;
    setDeckId(deck_id);
  }, []);

  const reshuffle = useCallback(async () => {
    await api.get(`api/deck/${deckId}/shuffle?remaining=true`);
  }, [deckId]);

  const getNewCard = useCallback(async () => {
    const resp = await api.get(`api/deck/${deckId}/draw/?count=1`);
    const { cards } = resp.data;

    const card = cards[0];
    setCard(card);
    await reshuffle();
    return card;
  }, [deckId, reshuffle]);

  function changeTurn() {
    const isP1Time = itsPlayer1Turn;

    setItsPlayer1Turn(!isP1Time);
    if (!isP1Time) setTurnCount(turnCount + 1);

    setSelectedSuit("");
    setSelectedValue("");
  }

  function updateScore(score: number) {
    if (itsPlayer1Turn) {
      toast(`Round points: ${score}`, {
        icon: false,
        className: "bg-dracula-green text-dracula-white",
      });
      setPlayer1({ ...player1, score: player1.score + score });
    } else {
      toast(`Round points: ${score}`, {
        icon: false,
        className: "bg-dracula-red text-dracula-white",
      });
      setPlayer2({ ...player2, score: player2.score + score });
    }
  }

  async function submitCard() {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  function getWinner() {
    let text;
    if (player1.score > player2.score) {
      text = "Player 1 Wins";
    } else if (player2.score > player1.score) {
      text = "Player 2 Wins";
    } else text = "DRAW";

    toast(`${text}`, {
      icon: false,
      className: "bg-dracula-pink text-dracula-bg",
    });
  }

  return {
    turnCount,
    itsPlayer1Turn,
    player1,
    player2,
    selectedValue,
    selectedSuit,
    card,
    submitCard,
    setSelectedSuit,
    setSelectedValue,
    isLoading,
  };
}
