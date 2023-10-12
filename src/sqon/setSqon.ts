import { participantBiospecimenKey, participantFileKey, participantKey } from '../config/env';
import { getSets } from '../endpoints/sets/setsFeature';
import { Set, SetSqon } from '../endpoints/sets/setsTypes';

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

const handleContent = async (content: any, sets: Set[]) => {
  const contents = [];
  const firstValue = content?.content?.value ? content.content.value[0] : '';
  const matches = setRegex.exec(firstValue);
  const setId = matches && matches[1] ? matches[1] : null;
  if (setId) {
    const set = sets.find(s => s.id === setId);
    const newContent = { ...content };
    newContent.content.field = getPathToParticipantId(set.setType);
    newContent.content.value = set.ids;
    contents.push(newContent);
  } else {
    contents.push(content);
  }
  return contents;
};

export const replaceSetByIds = async (sqon: SetSqon, accessToken: string) => {
  if (!sqon) {
    throw new Error('Sqon is missing');
  }

  const contents = [];
  const sets = await getSets(accessToken);

  for (const content of sqon.content) {
    if (Array.isArray(content.content)) {
      for (const deepContent of content.content) {
        contents.push(...(await handleContent(deepContent, sets)));
      }
    } else {
      contents.push(...(await handleContent(content, sets)));
    }
  }
  return { op: 'and', content: contents };
};
