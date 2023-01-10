import { initialFilterState } from "./constants";

export const filterReducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialFilterState;

    case "drafted":
    case "negative":
    case "avoid":
    case "injured":
      return { ...state, [action.type]: !state[action.type] };

    default:
      throw new Error();
  }
};
