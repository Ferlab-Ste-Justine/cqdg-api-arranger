const contents1 = [
  {
    content: [
      {
        content: {
          field: 'mondo.name',
          index: 'Participant',
          value: ['disease or disorder (MONDO:0000001)'],
        },
        op: 'in',
      },
    ],
    op: 'and',
  },
  {
    content: [
      {
        content: [
          {
            content: {
              field: 'mondo.name',
              index: 'Participant',
              value: ['disease or disorder (MONDO:0000001)'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      {
        content: [
          {
            content: {
              field: 'mondo.name',
              index: 'Participant',
              value: ['disease or disorder (MONDO:0000001)'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      {
        content: {
          field: 'mondo.name',
          index: 'Participant',
          value: ['disease or disorder (MONDO:0000001)'],
        },
        op: 'in',
      },
    ],
    op: 'and',
  },
];
