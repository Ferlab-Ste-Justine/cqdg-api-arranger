import { participantBiospecimenKey, participantFileKey, participantKey } from '../config/env';
import { getUserSet } from '../endpoints/sets/setsFeature';
import { SetSqon } from '../endpoints/sets/setsTypes';

const setRegex = /^set_id:(.+)$/gm;

const getPathToParticipantId = (type: string) => {
  if (type === 'biospecimen') {
    return participantBiospecimenKey;
  } else if (type === 'file') {
    return participantFileKey;
  } else {
    return participantKey;
  }
};

export const replaceSetByIds = async (sqon: SetSqon, accessToken: string, userId: string) => {
  if (!sqon) {
    throw new Error('Sqon is missing');
  }
  const contents = [];

  for (let i = 0; i < sqon.content.length; i++) {
    const c = sqon.content[i];

    if (c.content.value[0].match(setRegex)) {
      const match = setRegex.exec(c.content.value[0])[1];
      const set = await getUserSet(accessToken, userId, match);
      const newContent = { ...c };
      newContent.content.field = getPathToParticipantId(set.content.setType);
      newContent.content.value = set.content.ids;
      contents.push(newContent);
    } else {
      contents.push(c);
    }
  }
  return { op: 'and', content: contents };
};
