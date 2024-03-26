import {
  fetchBiospecimenStats,
  fetchFileFormatStats,
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
  participants: number;
  samples: number;
  variants: number;
  genomes: number;
  exomes: number;
};

export const getStatistics = async (): Promise<Statistics> => {
  const [files, studies, participants, fileSize, samples, variants] = await Promise.all([
    fetchFileStats(),
    fetchStudyStats(),
    fetchParticipantStats(),
    fetchFileSizeStats(),
    fetchBiospecimenStats(),
    fetchVariantStats(),
    fetchFileFormatStats('WGS'),
    fetchFileFormatStats('WXS'),
  ]);

  return {
    files,
    studies,
    participants,
    fileSize,
    samples,
    variants,
  } as Statistics;
};
