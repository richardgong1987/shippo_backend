export interface IVessels {
  id: number;
  name?: string | null;
  ownerid?: string | null;
  naccs?: string | null;
}

export type NewVessels = Omit<IVessels, 'id'> & { id: null };
