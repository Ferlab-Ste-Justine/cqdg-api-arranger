import { GraphQLObjectType, GraphQLString } from 'graphql';

const SequencingExperimentType = new GraphQLObjectType({
  name: 'SequencingExperimentType',
  fields: () => ({
    alir: { type: GraphQLString },
    analysis_id: { type: GraphQLString },
    bio_informatic_analysis: { type: GraphQLString },
    capture_kit: { type: GraphQLString },
    experimental_strategy: { type: GraphQLString },
    gcnv: { type: GraphQLString },
    genome_build: { type: GraphQLString },
    gsv: { type: GraphQLString },
    labAliquotID: { type: GraphQLString },
    ldm_sample_id: { type: GraphQLString },
    owner: { type: GraphQLString },
    platform: { type: GraphQLString },
    read_length: { type: GraphQLString },
    run_alias: { type: GraphQLString },
    run_date: { type: GraphQLString },
    run_name: { type: GraphQLString },
    sequencer_id: { type: GraphQLString },
    snv: { type: GraphQLString },
    ssup: { type: GraphQLString },
    type_of_sequencing: { type: GraphQLString },
    workflow_name: { type: GraphQLString },
    workflow_version: { type: GraphQLString },
  }),
});

export default SequencingExperimentType;
