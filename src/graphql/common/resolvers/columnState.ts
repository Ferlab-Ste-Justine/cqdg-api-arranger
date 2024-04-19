import { createColumnSetState } from '../../../arranger/columnState';

const columnStateResolver = async (args, type) => {
  const result = await createColumnSetState({
    esIndex: type.extensions.esIndex,
    graphqlField: type.name,
  });
  return result;
};

export default columnStateResolver;
