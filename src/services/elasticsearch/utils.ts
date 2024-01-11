export const getBody = ({ field, value, path, nested = false }) => {
  if (nested) {
    return {
      query: {
        bool: {
          must: [
            {
              nested: {
                path,
                query: { bool: { must: [{ match: { [field]: value } }] } },
              },
            },
          ],
        },
      },
    };
  }
  return {
    query: {
      bool: {
        must: [
          {
            match: { [field]: value },
          },
        ],
      },
    },
  };
};
