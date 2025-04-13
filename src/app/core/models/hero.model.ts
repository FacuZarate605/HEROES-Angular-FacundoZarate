export interface Hero {
  id: number;
  name: string;
  alias?: string;
  powers: string[];
  publisher: string;
  firstAppearance: Date;
  imageUrl: string;
}

export type HeroForm = Omit<Hero, 'id'>;