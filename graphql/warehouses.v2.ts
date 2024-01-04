import { fetchGraphQL } from './client';

const operationsDocData = `
  query Warehouses @cached {
    DERIVED_REAL_IDLE_BY_DAY_aggregate(where: {TIME_DAY: {_gt: "2023-11-01", _lte: "2024-01-01"}}) {
      aggregate {
        sum {
          IDLE_CREDIT
          QUERY_CREDIT
          TOTAL
          TOTAL_COMPUTE_CREDIT
        }
      }
      nodes {
        WAREHOUSE_ANOMALY_aggregate(limit: 100) {
          nodes {
            FINDING_IDS
            CATEGORIES
            BEHIND_PAYWALL
            AUTO_SUSPEND
            MIN_CLUSTER
            MAX_CLUSTER
            INGESTED_AT
            ROOT_CAUSE_ENTITY
            SCALING_POLICY
            WAREHOUSE_SIZE
            WAREHOUSE_TYPE
          }
        }
        TIME_DAY
        WAREHOUSE_NAME
        COST_HISTORY
      }
    }
  }
`;