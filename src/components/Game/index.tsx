import { Button } from "../Button";
import { CARD_VALUES, SUITES, SUITES_PROTO } from "../../utils/values";
import backCardImg from "../../assets/images/back-card.png";
import { useGame } from "../../hooks/useGame";
import { ToastContainer } from "react-toastify";

export function Game() {
  const {
    card,
    itsPlayer1Turn,
    player1,
    player2,
    selectedSuit,
    selectedValue,
    submitCard,
    turnCount,
    setSelectedSuit,
    setSelectedValue,
    isLoading,
  } = useGame();

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

        <section className="mt-2 flex justify-center">
          {card ? (
            <img src={card?.image} alt="card" />
          ) : (
            <img className="w-96" src={backCardImg} alt="card" />
          )}
        </section>

        <div
          className={`mt-2 flex justify-center flex-col items-center ${
            itsPlayer1Turn ? "text-dracula-green" : "text-dracula-red"
          }`}
        >
          <h3> SELECTED VALUE: {selectedValue}</h3>
          <h3> SELECTED SUIT: {selectedSuit}</h3>
        </div>

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
            isLoading={isLoading}
          >
            Submit card
          </Button>
        </footer>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
