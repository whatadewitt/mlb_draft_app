export const MODES = {
  DRAFT: "draft",
  EDIT: "edit",
};

export const SORT_BY = {
  PRICE: "price",
  ADP: "adp",
};

export const playerLimits = {
  "1B": 50,
  "2B": 60,
  "3B": 60,
  SS: 50,
  OF: 150,
  SP: 150,
  RP: 150,
  DH: 40,
  C: 40,
};

export const initialPlayerData = {
  "1B": [],
  "2B": [],
  "3B": [],
  SS: [],
  OF: [],
  SP: [],
  RP: [],
  C: [],
  DH: [],
};

export const initialFilterState = {
  drafted: false,
  negative: false,
  injured: false,
  avoid: false,
};

export const FLAGS = {
  AVOID: "avoid",
  INJURED: "injured",
  TARGET: "target",
};
