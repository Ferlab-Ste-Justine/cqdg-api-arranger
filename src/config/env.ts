import dotenv from 'dotenv';

dotenv.config();

export const project = process.env.PROJECT;
export const port = process.env.PORT || 5050;
export const env = process.env.NODE_ENV || 'production';
export const isDev = env === 'development';

export const keycloakURL = process.env.KEYCLOAK_URL || 'https://auth.qa.cqdg.ferlab.bio/auth';
export const keycloakRealm = process.env.KEYCLOAK_REALM || 'CQDG';
export const keycloakClient = process.env.KEYCLOAK_CLIENT || 'cqdg-client';

export const esHost = process.env.ES_HOST || 'http://localhost:9200';
export const esUser = process.env.ES_USER;
export const esPass = process.env.ES_PASS;

export const esFileIndex = process.env.ES_FILE_INDEX || 'file_centric';
export const esStudyIndex = process.env.ES_STUDY_INDEX || 'study_centric';
export const esParticipantIndex = process.env.ES_PARTICIPANT_INDEX || 'participant_centric';
export const esBiospecimenIndex = process.env.ES_BIOSPECIMEN_INDEX || 'biospecimen_centric';
export const esVariantIndex = process.env.ES_VARIANT_INDEX || 'variant_centric';
export const esGeneIndex = process.env.ES_GENE_INDEX || 'gene_centric';

export const maxNOfGenomicFeatureSuggestions = process.env.MAX_NUMBER_OF_GF_SUGGESTIONS || 5;

export const indexNameGeneFeatureSuggestion = process.env.GENES_SUGGESTIONS_INDEX_NAME || 'clin_qa_gene_suggestions';
export const indexNameVariantFeatureSuggestion =
  process.env.VARIANTS_SUGGESTIONS_INDEX_NAME || 'clin_qa_variant_suggestions';

export const usersApiURL = process.env.USERS_API_URL || 'https://users.qa.cqdg.ferlab.bio';
export const sendUpdateToSqs = process.env.SEND_UPDATE_TO_SQS === 'true';
export const sqsQueueUrl = process.env.SQS_QUEUE_URL || '';
export const maxSetContentSize: number = Number.parseInt(process.env.MAX_SET_CONTENT_SIZE) || 10000;

export const fileIdKey = process.env.FILE_ID_KEY || 'file_id';
export const studyIdKey = process.env.STUDY_ID_KEY || 'study_id';
export const participantIdKey = process.env.PARTICIPANT_ID_KEY || 'participant_id';
export const biospecimenIdKey = process.env.BIOSPECIMEN_ID_KEY || 'sample_id';
export const variantIdKey = process.env.VARIANT_ID_KEY || 'id';

export const participantKey = process.env.TO_PARTICIPANT_ID_KEY || 'participant_id';
export const participantFileKey = process.env.TO_PARTICIPANT_FILE_ID_KEY || 'files.file_id';
export const participantBiospecimenKey = process.env.TO_PARTICIPANT_BIOSPECIMEN_ID_KEY || 'biospecimens.sample_id';

export const cacheTTL: number = Number.parseInt(process.env.CACHE_TTL_SEC) || 3600;
