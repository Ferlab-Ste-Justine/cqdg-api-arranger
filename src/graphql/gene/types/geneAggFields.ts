import AggregationsType from '../../common/types/aggregationsType';

const GeneAggFields = {
  genes__symbol: { type: AggregationsType },
  genes__consequences__vep_impact: { type: AggregationsType },
  genes__consequences__consequence: { type: AggregationsType },
  genes__consequences__picked: { type: AggregationsType },
};

export default GeneAggFields;
