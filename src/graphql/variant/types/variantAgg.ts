import { GraphQLObjectType } from 'graphql';

import AggregationsType, { NumericAggregationsType } from '../../common/types/aggregationsType';

const VariantAggType = new GraphQLObjectType({
  name: 'VariantAggType',
  fields: {
    alternate: { type: AggregationsType },
    assembly_version: { type: AggregationsType },
    chromosome: { type: AggregationsType },
    clinvar__clin_sig: { type: AggregationsType },
    clinvar__clinvar_id: { type: AggregationsType },
    clinvar__conditions: { type: AggregationsType },
    clinvar__inheritance: { type: AggregationsType },
    clinvar__interpretations: { type: AggregationsType },
    cmc__cosmic_id: { type: AggregationsType },
    cmc__mutation_url: { type: AggregationsType },
    cmc__sample_mutated: { type: NumericAggregationsType },
    cmc__sample_ratio: { type: NumericAggregationsType },
    cmc__sample_tested: { type: NumericAggregationsType },
    cmc__shared_aa: { type: NumericAggregationsType },
    cmc__tier: { type: AggregationsType },
    dna_change: { type: AggregationsType },
    end: { type: NumericAggregationsType },
    external_frequencies__gnomad_exomes_2_1_1__ac: { type: NumericAggregationsType },
    external_frequencies__gnomad_exomes_2_1_1__af: { type: NumericAggregationsType },
    external_frequencies__gnomad_exomes_2_1_1__an: { type: NumericAggregationsType },
    external_frequencies__gnomad_exomes_2_1_1__hom: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_2_1_1__ac: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_2_1_1__af: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_2_1_1__an: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_2_1_1__hom: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_3__ac: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_3__af: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_3__an: { type: NumericAggregationsType },
    external_frequencies__gnomad_genomes_3__hom: { type: NumericAggregationsType },
    external_frequencies__thousand_genomes__ac: { type: NumericAggregationsType },
    external_frequencies__thousand_genomes__af: { type: NumericAggregationsType },
    external_frequencies__thousand_genomes__an: { type: NumericAggregationsType },
    external_frequencies__topmed_bravo__ac: { type: NumericAggregationsType },
    external_frequencies__topmed_bravo__af: { type: NumericAggregationsType },
    external_frequencies__topmed_bravo__an: { type: NumericAggregationsType },
    external_frequencies__topmed_bravo__het: { type: NumericAggregationsType },
    external_frequencies__topmed_bravo__hom: { type: NumericAggregationsType },
    gene_external_reference: { type: AggregationsType },
    genes__alias: { type: AggregationsType },
    genes__biotype: { type: AggregationsType },
    genes__consequences__aa_change: { type: AggregationsType },
    genes__consequences__amino_acids__reference: { type: AggregationsType },
    genes__consequences__amino_acids__variant: { type: AggregationsType },
    genes__consequences__canonical: { type: AggregationsType },
    genes__consequences__cdna_position: { type: AggregationsType },
    genes__consequences__cds_position: { type: AggregationsType },
    genes__consequences__coding_dna_change: { type: AggregationsType },
    genes__consequences__codons__reference: { type: AggregationsType },
    genes__consequences__codons__variant: { type: AggregationsType },
    genes__consequences__consequence: { type: AggregationsType },
    genes__consequences__conservations__phyloP100way_vertebrate: { type: NumericAggregationsType },
    genes__consequences__conservations__phyloP17way_primate: { type: NumericAggregationsType },
    genes__consequences__ensembl_feature_id: { type: AggregationsType },
    genes__consequences__ensembl_transcript_id: { type: AggregationsType },
    genes__consequences__exon__rank: { type: AggregationsType },
    genes__consequences__exon__total: { type: NumericAggregationsType },
    genes__consequences__feature_type: { type: AggregationsType },
    genes__consequences__hgvsc: { type: AggregationsType },
    genes__consequences__hgvsp: { type: AggregationsType },
    genes__consequences__impact_score: { type: NumericAggregationsType },
    genes__consequences__intron__rank: { type: AggregationsType },
    genes__consequences__intron__total: { type: NumericAggregationsType },
    genes__consequences__mane_plus: { type: AggregationsType },
    genes__consequences__mane_select: { type: AggregationsType },
    genes__consequences__picked: { type: AggregationsType },
    genes__consequences__predictions__cadd_phred: { type: NumericAggregationsType },
    genes__consequences__predictions__cadd_score: { type: NumericAggregationsType },
    genes__consequences__predictions__dann_score: { type: NumericAggregationsType },
    genes__consequences__predictions__fathmm_pred: { type: AggregationsType },
    genes__consequences__predictions__fathmm_score: { type: NumericAggregationsType },
    genes__consequences__predictions__lrt_pred: { type: AggregationsType },
    genes__consequences__predictions__lrt_score: { type: NumericAggregationsType },
    genes__consequences__predictions__polyphen2_hvar_pred: { type: AggregationsType },
    genes__consequences__predictions__polyphen2_hvar_score: { type: NumericAggregationsType },
    genes__consequences__predictions__revel_score: { type: NumericAggregationsType },
    genes__consequences__predictions__sift_pred: { type: AggregationsType },
    genes__consequences__predictions__sift_score: { type: NumericAggregationsType },
    genes__consequences__protein_position: { type: AggregationsType },
    genes__consequences__refseq_mrna_id: { type: AggregationsType },
    genes__consequences__refseq_protein_id: { type: AggregationsType },
    genes__consequences__strand: { type: AggregationsType },
    genes__consequences__uniprot_id: { type: AggregationsType },
    genes__consequences__vep_impact: { type: AggregationsType },
    genes__cosmic__tumour_types_germline: { type: AggregationsType },
    genes__ddd__disease_name: { type: AggregationsType },
    genes__ensembl_gene_id: { type: AggregationsType },
    genes__entrez_gene_id: { type: NumericAggregationsType },
    genes__gnomad__loeuf: { type: NumericAggregationsType },
    genes__gnomad__pli: { type: NumericAggregationsType },
    genes__hgnc: { type: AggregationsType },
    genes__hpo__hpo_term_id: { type: AggregationsType },
    genes__hpo__hpo_term_label: { type: AggregationsType },
    genes__hpo__hpo_term_name: { type: AggregationsType },
    genes__location: { type: AggregationsType },
    genes__name: { type: AggregationsType },
    genes__omim__inheritance: { type: AggregationsType },
    genes__omim__inheritance_code: { type: AggregationsType },
    genes__omim__name: { type: AggregationsType },
    genes__omim__omim_id: { type: AggregationsType },
    genes__omim_gene_id: { type: AggregationsType },
    genes__orphanet__disorder_id: { type: NumericAggregationsType },
    genes__orphanet__inheritance: { type: AggregationsType },
    genes__orphanet__panel: { type: AggregationsType },
    genes__spliceai__ds: { type: NumericAggregationsType },
    genes__spliceai__type: { type: AggregationsType },
    genes__symbol: { type: AggregationsType },
    hash: { type: AggregationsType },
    hgvsg: { type: AggregationsType },
    internal_frequencies_wgs__total__ac: { type: NumericAggregationsType },
    internal_frequencies_wgs__total__af: { type: NumericAggregationsType },
    internal_frequencies_wgs__total__an: { type: NumericAggregationsType },
    internal_frequencies_wgs__total__hom: { type: NumericAggregationsType },
    internal_frequencies_wgs__total__pc: { type: NumericAggregationsType },
    internal_frequencies_wgs__total__pf: { type: NumericAggregationsType },
    internal_frequencies_wgs__total__pn: { type: NumericAggregationsType },
    locus: { type: AggregationsType },
    max_impact_score: { type: NumericAggregationsType },
    reference: { type: AggregationsType },
    rsnumber: { type: AggregationsType },
    sources: { type: AggregationsType },
    start: { type: NumericAggregationsType },
    studies__study_code: { type: AggregationsType },
    studies__study_id: { type: AggregationsType },
    studies__zygosity: { type: AggregationsType },
    study_frequencies_wgs__study_code: { type: AggregationsType },
    study_frequencies_wgs__study_id: { type: AggregationsType },
    study_frequencies_wgs__total__ac: { type: NumericAggregationsType },
    study_frequencies_wgs__total__af: { type: NumericAggregationsType },
    study_frequencies_wgs__total__an: { type: NumericAggregationsType },
    study_frequencies_wgs__total__hom: { type: NumericAggregationsType },
    study_frequencies_wgs__total__pc: { type: NumericAggregationsType },
    study_frequencies_wgs__total__pf: { type: NumericAggregationsType },
    study_frequencies_wgs__total__pn: { type: NumericAggregationsType },
    variant_class: { type: AggregationsType },
    variant_external_reference: { type: AggregationsType },
  },
});

export default VariantAggType;
