/* eslint-disable no-console */
import 'regenerator-runtime/runtime';

import { Client } from '@elastic/elasticsearch';

import { countNOfDocs, createIndexIfNeeded } from '../dist/src/services/elasticsearch';
import { ArrangerApi } from './arrangerApi.mjs';
import { projectsConfig } from './projectsConfig.mjs';
import {
  esHost,
  esPass,
  esUser,
  esFileIndex,
  esBiospecimenIndex,
  esParticipantIndex,
  esStudyIndex,
  esVariantIndex,
  esGeneIndex
} from '../dist/src/config/env';

const client = new Client({
  node: esHost,
  auth: {
    password: esPass,
    username: esUser,
  },
});

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

const hasProjectArrangerMetadataIndex = async (esClient, projectName) => {
  const r = await esClient.indices.exists({
    index: ArrangerApi.getProjectMetadataEsLocation(projectName).index,
  });
  return !!r?.body;
};

const deleteProjectIndices = async (esClient, docs, project) => {
  for (const d of docs) {
    try {
      const rem = ArrangerApi.removeProjectIndex(client);
      await rem({ projectId: project, graphqlField: d });
    } catch (err) {
      //nothing
    }
  }
};

const isProjectListedInArranger = async (esClient, projectName) => {
  const r = await esClient.exists({
    index: ArrangerApi.constants.ARRANGER_PROJECT_INDEX,
    id: projectName,
  });
  return !!r?.body;
};

const sameIndices = (xs, ys) => {
  const s = new Set(ys);
  return xs.length === ys.length && xs.every(x => s.has(x));
};

const updateProjectBackup = async name => {
  const ES_UPDATE_WAIT_TIME = 5000
  const backupIndex = await client.indices.exists({ index: `arranger-projects-${name}-backup` });

  if (backupIndex.body) {
    await client.indices.delete({ index: `arranger-projects-${name}-backup` });
  }

  await client.indices.create({ index: `arranger-projects-${name}-backup` });
  await client.reindex({
    body: {
      source: {
        index: `arranger-projects-${name}`,
      },
      dest: {
        index: `arranger-projects-${name}-backup`,
      },
    },
  });

  //wait N seconds, ensure index was created and reindexed (if not will always return 0 count)
  await new Promise(r => setTimeout(r, ES_UPDATE_WAIT_TIME));
  return client.count({ index: `arranger-projects-${projectName}-backup` });
};

//===== Start =====//
console.info(`admin-project-script - Starting script`);

const projectIndices = [esFileIndex, esParticipantIndex, esStudyIndex, esBiospecimenIndex, esVariantIndex, esGeneIndex];

if (projectIndices.length === 0) {
  console.warn(
    `admin-project-script - Terminating. No indices needed to build a project was found in the env var 'PROJECT_INDICES'.`,
  );
  process.exit(0);
}

const allProjectsConf = projectsConfig();

const projectsConf = allProjectsConf.filter(p => {
  const indicesInConf = p.indices.map(i => i.esIndex);
  return sameIndices(indicesInConf, projectIndices);
});

if (projectsConf.length === 0) {
  console.info('admin-project-script - Terminating. Found no project configuration to process.');
  process.exit(0);
} else if (projectsConf.length > 1) {
  console.info(
    'admin-project-script - Terminating. Found more than one candidates for project configurations. This is ambiguous.',
  );
  process.exit(0);
}

const projectConf = projectsConf[0];
const projectName = projectConf.name;

await sleep(360000)

console.debug(`admin-project-script - Reaching to ElasticSearch at ${esHost}`);


const addArrangerProjectWithClient = ArrangerApi.addArrangerProject(client);

const hasCreatedIndex = await createIndexIfNeeded(client, ArrangerApi.constants.ARRANGER_PROJECT_INDEX);
if (hasCreatedIndex) {
  console.info(
    `admin-project-script - Created this index: '${ArrangerApi.constants.ARRANGER_PROJECT_INDEX}'. Since no existing arranger projects detected.`,
  );
}
const resolveSanityConditions = async () =>
  await Promise.all([
    hasProjectArrangerMetadataIndex(client, projectName),
    isProjectListedInArranger(client, projectName),
  ]);

const creationConditions = await resolveSanityConditions();

/*
    Check if project exists and is listed in arranger-projects
    If it does not it will create it
* */
if (creationConditions.every(b => !b)) {
  console.debug(
    `admin-project-script - Creating a new metadata project since no existing project='${projectName}' detected.`,
  );
  const addResp = await addArrangerProjectWithClient(projectName);
  console.debug(`admin-project-script - (Project addition) received this response from arranger api: `, addResp);
  console.debug(
    `admin-project-script - Creating these new graphql fields: ${projectConf.indices
      .map(i => `'${i.graphqlField}' from es index '${i.esIndex}'`)
      .join(', ')}`,
  );
  await ArrangerApi.createNewIndices(client, projectConf.indices);
} else if (creationConditions.some(b => b !== creationConditions[0])) {
  console.warn(
    `admin-project-script - The project seems to be in a weird state for '${projectName}' does ${
      creationConditions[0] ? '' : 'not '
    } exist while it is ${creationConditions[1] ? '' : 'not '}listed in ${
      ArrangerApi.constants.ARRANGER_PROJECT_INDEX
    }`,
  );
} else if (creationConditions.every(b => b)) {
  const projBackup = await updateProjectBackup(projectName);

  if (projBackup.statusCode === 200 && projBackup.body.count > 0) {
    const docNames = projectConf.indices.map(r => r.graphqlField);
    //delete affected docs
    await deleteProjectIndices(client, docNames, projectName);
    //re-create affected docs
    await ArrangerApi.createNewIndices(client, projectConf.indices);

    console.debug(`admin-project-script - Applying extended mapping mutations.`);
    await ArrangerApi.fixExtendedMapping(client, projectConf.extendedMappingMutations);
  }
}

console.debug(`admin-project-script - Terminating script.`);
process.exit(0);
