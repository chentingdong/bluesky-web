import { DateRange } from '@/app/components/globalDateFilter';
import { fetchGraphQL } from './client';

// 
const operationsDocData = `
  query Warehouses(
    $limit: Int!, 
    $offset: Int!,
    $orderBy: [WAREHOUSE_ANOMALY_order_by!]
    $filterBy: WAREHOUSE_ANOMALY_bool_exp
    $dateRangeFilter: DERIVED_REAL_IDLE_BY_DAY_bool_exp
  ) @cached {
    WAREHOUSE_ANOMALY_aggregate(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $filterBy
    ) {
      nodes {
        WAREHOUSE_NAME
        WAREHOUSE_SIZE
        WAREHOUSE_TYPE
        SCALING_POLICY
        ROOT_CAUSE_ENTITY
        MIN_CLUSTER
        MAX_CLUSTER
        INGESTED_AT
        FINDING_IDS
        CATEGORIES
        BEHIND_PAYWALL
        AUTO_SUSPEND
        ANNUAL_WASTE_USD
        ANOMALY_WAREHOUSE_aggregate(where: $dateRangeFilter) {
          aggregate {
            sum {
              IDLE_CREDIT
              QUERY_CREDIT
              TOTAL
              TOTAL_COMPUTE_CREDIT
            }
          }
        }
      }
    }
  }
`;

export async function fetchWarehouses(limit: number, offset: number, orderBy: any, filterBy: any, dateRangeFilter: any) {
  const response = await fetchGraphQL(
    operationsDocData,
    "Warehouses",
    {limit, offset, orderBy, filterBy, dateRangeFilter}
  );

  const warehouses = response.data?.WAREHOUSE_ANOMALY_aggregate.nodes.map((node: any) => {
    const anomalyWarehouse = node.ANOMALY_WAREHOUSE_aggregate.aggregate.sum;
    return {
      WAREHOUSE_NAME: node.WAREHOUSE_NAME,
      WAREHOUSE_SIZE: node.WAREHOUSE_SIZE,
      CLUSTERS: node.MIN_CLUSTER + '-' + node.MAX_CLUSTER,
      AUTO_SUSPEND: node.AUTO_SUSPEND,
      IDLE_CREDIT: anomalyWarehouse.IDLE_CREDIT,
      QUERY_CREDIT: anomalyWarehouse.QUERY_CREDIT,
      UTILIZATION: anomalyWarehouse.TOTAL/(anomalyWarehouse.TOTAL_COMPUTE_CREDIT+0.01),
      ANNUAL_WASTE_USD: node.ANNUAL_WASTE_USD,
      FINDING_IDS: node.FINDING_IDS,
    }
  })
  console.log(response.data?.WAREHOUSE_ANOMALY_aggregate.nodes)
  return warehouses || [];
}


export function createWarehouseDataSource(dateRange: DateRange) {
  return {
    getRows: (params: any) => {
      const { startRow, endRow } = params.request;

      //server side pagination
      const limit = endRow - startRow;
      const offset = startRow;

      //server side sorting
      const orderBy: { [key: string]: string } = {};
      params.request.sortModel.forEach((item: any) => {
        orderBy[item.colId] = item.sort.toLowerCase();
      });

      // server side filtering
      const filterBy: { [key: string]: { [type: string]: string } } = {};
      Object.entries(params.request.filterModel).forEach(([key, value]) => {
        const { type, filter } = value as FilterModel;
        filterBy[key] = { [type]: filter };
      });

      // date range filter
      const dateRangeFilter = {
        TIME_DAY: {
          _gte: dateRange.startDate,
          _lte: dateRange.endDate
        }
      }

      // fetch data through graphql call
      const response = fetchWarehouses(limit, offset, orderBy, filterBy, dateRangeFilter).then((response) => {
        params.success({
          rowData: response,
          rowCount: fetchWarehouseCount()
        });
      });

      return response;
    }
  }
}

// total warehouse count
const operationsDocCount = `
  query Warehouses @cached {
    WAREHOUSE_ANOMALY_aggregate {
      aggregate {
        count(distinct: true, column: WAREHOUSE_NAME)
      }
    }
  }
`;

function fetchWarehouseCount() {
  fetchGraphQL(
    operationsDocCount,
    "Warehouses",
    {}
  ).then((response) => {
    return response.data?.WAREHOUSE_ANOMALY_aggregate.aggregate?.count || 0;
  }).catch((error) => {
    console.error(error);
    return 0; 
  })
}


// types
export interface FilterModel {
  type: string;
  filterType: string;
  filter: any;
}