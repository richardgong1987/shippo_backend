import { IVessels, NewVessels } from './vessels.model';

export const sampleWithRequiredData: IVessels = {
  id: 48371,
};

export const sampleWithPartialData: IVessels = {
  id: 87435,
};

export const sampleWithFullData: IVessels = {
  id: 27465,
  name: 'copying bandwidth Principal',
  ownerid: 'Brooks paradigms',
  naccs: 'quantifying',
};

export const sampleWithNewData: NewVessels = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
