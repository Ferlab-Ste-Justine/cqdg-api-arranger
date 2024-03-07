import VariantsType from './types/variant';

export const getVariants = {
  type: VariantsType,
  description: 'get variants',
  /** nothing there because we resolve on the field nested 'hits' */
  resolve: (): unknown => ({}),
};

export default getVariants;
