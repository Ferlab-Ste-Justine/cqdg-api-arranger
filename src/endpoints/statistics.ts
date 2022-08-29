import {
  fetchBiospecimenStats,
  fetchFamilyStats,
  fetchFileSizeStats,
  fetchFileStats,
  fetchParticipantStats,
  fetchStudyStats,
  fetchVariantStats,
} from '../services/elasticsearch';

export type Statistics = {
  files: number;
  fileSize: string;
  studies: number;
  families: number;
  participants: number;
  samples: number;
  variants: number;
};

export const getStatistics = async (): Promise<Statistics> => {
  const [files, studies, participants, families, fileSize] = await Promise.all([
    fetchFileStats(),
    fetchStudyStats(),
    fetchParticipantStats(),
    fetchFamilyStats(),
    fetchFileSizeStats(),
    // fetchBiospecimenStats(),
    // fetchVariantStats(),
  ]);

  return {
    files,
    studies,
    participants,
    families,
    fileSize,
    // samples,
    // variants,
  } as Statistics;
};
