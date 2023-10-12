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

interface ISqonContent {
  content: {
    field: string;
    index: string;
    value: any[];
    remoteComponent: any[];
  };
  op: 'in';
}

const handleContent = async (content: ISqonContent, sets: Set[]) => {
  try {
    const contents = [];
    const matches = setRegex.exec(content?.content.value ? content.content.value[0] : '');
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
  } catch (error) {
    console.error('[handleContent] content:', content, error);
  }
};

const handleContentRecursively = async (content: any, sets: Set[]) => {
  const contents = [];
  if (Array.isArray(content)) {
    for (const deepContent of content) {
      contents.push(...(await handleContentRecursively(deepContent, sets)));
    }
  } else {
    contents.push(...(await handleContent(content, sets)));
  }
  return contents;
};

export const replaceSetByIds = async (sqon: SetSqon, accessToken: string, userId: string) => {
  if (!sqon) {
    throw new Error('Sqon is missing');
  }
  const sets = await getSets(accessToken);
  const contents = await handleContentRecursively(sqon.content, sets);
  return { op: 'and', content: contents };
};
