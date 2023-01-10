export interface Player {
  id: string;
  name: string;
  adp: number;
  price: number;
  iPrice: number;
  cost: number;
  position: string;
  notes: string;
  target: boolean;
  drafted: boolean;
  avoid: boolean;
  injured: boolean;
  customPrice: number;
}
