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
  const matches = setRegex.exec(content?.content?.value ? content.content.value[0] : '');
  const setId = matches && matches[1] ? matches[1] : null;
  console.log('setId===', setId);
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
  console.log('------------------replaceSetByIds------------------');
  if (!sqon) {
    throw new Error('Sqon is missing');
  }

  let contents = [];
  const sets = await getSets(accessToken);

  for (const content of sqon.content) {
    if (Array.isArray(content.content)) {
      console.log('TOP');
      for (const deepContent of content.content) {
        contents.push(...(await handleContent(deepContent, sets)));
      }
    } else {
      console.log('here');
      contents = await handleContent(content, sets);
    }
  }
  console.log('sqon   content===', JSON.stringify(sqon.content, null, 2));
  console.log('contents==', JSON.stringify(contents, null, 2));

  return { op: 'and', content: contents };
};
