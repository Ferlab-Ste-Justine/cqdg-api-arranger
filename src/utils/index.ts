import variantExtendedMapping from '@ferlab/next/lib/graphql/variant/extendedMapping';

import {
  esBiospecimenIndex,
  esFileIndex,
  esGeneIndex,
  esParticipantIndex,
  esStudyIndex,
  esVariantIndex,
} from '#src/config/env';
import sampleExtendedMapping from '#src/graphql/biospecimen/extendedMapping';
import fileExtendedMapping from '#src/graphql/file/extendedMapping';
import geneExtendedMapping from '#src/graphql/gene/extendedMapping';
import participantExtendedMapping from '#src/graphql/participant/extendedMapping';
import studyExtendedMapping from '#src/graphql/study/extendedMapping';

export const getExtendedMappingByIndex = (graphqlIndex = '') => {
  switch (graphqlIndex) {
    case 'Participant':
      return participantExtendedMapping;
    case 'Biospecimen':
      return sampleExtendedMapping;
    case 'File':
      return fileExtendedMapping;
    case 'Variant':
      return variantExtendedMapping;
    case 'Gene':
      return geneExtendedMapping;
    case 'Study':
      return studyExtendedMapping;
  }
};

export const getESIndexByIndex = (graphqlIndex = ''): string => {
  switch (graphqlIndex) {
    case 'Participant':
      return esParticipantIndex;
    case 'Biospecimen':
      return esBiospecimenIndex;
    case 'File':
      return esFileIndex;
    case 'Variant':
      return esVariantIndex;
    case 'Gene':
      return esGeneIndex;
    case 'Study':
      return esStudyIndex;
  }
};
