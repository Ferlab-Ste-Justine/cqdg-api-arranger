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

export const esFileIndex = process.env.ES_FILE_INDEX || 'files';
export const esStudyIndex = process.env.ES_STUDY_INDEX || 'studies';
export const esParticipantIndex = process.env.ES_PARTICIPANT_INDEX || 'participants'; // change to participants
export const esBiospecimenIndex = process.env.ES_BIOSPECIMEN_INDEX || 'biospecimens';
export const esVariantIndex = process.env.ES_VARIANT_INDEX || 'clin_qa_variant_centric';

export const maxNOfGenomicFeatureSuggestions = process.env.MAX_NUMBER_OF_GF_SUGGESTIONS || 5;

export const indexNameGeneFeatureSuggestion = process.env.GENES_SUGGESTIONS_INDEX_NAME || 'clin_qa_gene_suggestions';
export const indexNameVariantFeatureSuggestion =
  process.env.VARIANTS_SUGGESTIONS_INDEX_NAME || 'clin_qa_variant_suggestions';

export const usersApiURL = process.env.USERS_API_URL || 'https://users.qa.cqdg.ferlab.bio';
export const sendUpdateToSqs = process.env.SEND_UPDATE_TO_SQS !== 'false';
export const sqsQueueUrl = process.env.SQS_QUEUE_URL || '';
export const maxSetContentSize: number = Number.parseInt(process.env.MAX_SET_CONTENT_SIZE) || 10000;

export const survivalPyFile = process.env.SURVIVAL_PY_FILE || 'resource/py/survival.py';
export const pythonPath = process.env.PYTHON_PATH || '/usr/local/bin/python3';

export const fileIdKey = process.env.FILE_ID_KEY || 'internal_file_id';
export const studyIdKey = process.env.STUDY_ID_KEY || 'internal_study_id';
export const participantIdKey = process.env.PARTICIPANT_ID_KEY || 'internal_donor_id'; //todo: change to participant
export const biospecimenIdKey = process.env.BIOSPECIMEN_ID_KEY || 'internal_biospecimen_id';
export const variantIdKey = process.env.VARIANT_ID_KEY || 'internal_variant_id';
export const familyIdKey = process.env.FAMILY_ID_KEY || '----';
export const idKey = process.env.ID_KEY || 'id';

export const participantKey = process.env.TO_PARTICIPANT_ID_KEY || 'participant';
export const participantFileKey = process.env.TO_PARTICIPANT_FILE_ID_KEY || 'participantFile';
export const participantBiospecimenKey = process.env.TO_PARTICIPANT_BIOSPECIMEN_ID_KEY || 'participantBiospecimen';

export const cacheTTL: number = Number.parseInt(process.env.CACHE_TTL_SEC) || 3600;
