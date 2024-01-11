import GenesType from './types/gene';

export const getGenes = {
  type: GenesType,
  description: 'get genes',
  resolve: (): unknown => ({}),
};

export default getGenes;
