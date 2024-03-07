import StudiesType from './types/study';

export const getStudies = {
  type: StudiesType,
  description: 'get studies',
  resolve: (): unknown => ({}),
};

export default getStudies;
