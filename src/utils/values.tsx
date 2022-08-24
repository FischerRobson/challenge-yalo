import { ImClubs, ImDiamonds, ImSpades, ImHeart } from "react-icons/im";

export const CARD_VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "QUEEN",
  "JACK",
  "KING",
];

export const SUITES = ["DIAMONDS", "HEARTS", "CLUBS", "SPADES"] as const;

export const SUITES_PROTO = {
  CLUBS: {
    value: "CLUBS",
    image: <ImClubs />,
  },
  HEARTS: {
    value: "HEARTS",
    image: <ImHeart />,
  },
  DIAMONDS: {
    value: "DIAMONDS",
    image: <ImDiamonds />,
  },
  SPADES: {
    value: "SPADES",
    image: <ImSpades />,
  },
} as const;

// export const SUITES = Object.keys(SUITES_PROTO);
