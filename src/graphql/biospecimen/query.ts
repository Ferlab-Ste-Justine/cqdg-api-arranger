import BiospecimensType from './types/biospecimen';

export const getBiospecimens = {
  type: BiospecimensType,
  description: 'get biospecimens',
  resolve: (): unknown => ({}),
};

export default getBiospecimens;
