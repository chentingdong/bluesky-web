import { fetchGraphQL } from './client';

// warehouse data
const operationsDocData = `
  query Warehouses(
    $limit: Int!, 
    $offset: Int!,
    $order_by: [WAREHOUSES_order_by!]
    $filter_by: WAREHOUSES_bool_exp
  ) @cached {
    WAREHOUSES(
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $filter_by
    ) {
      WAREHOUSE_NAME
      WAREHOUSE_SIZE
      MIN_CLUSTER
      MAX_CLUSTER
      AUTO_SUSPEND
      QUERY_CREDIT
      COST_HISTORY
      UTILIZATION
    }
  }
`;

export interface FilterModel {
  type: string;
  filterType: string;
  filter: any;
}

export async function fetchWarehouses(limit: number, offset: number, order_by: any, filter_by: any) {
  const response = await fetchGraphQL(
    operationsDocData,
    "Warehouses",
    {limit, offset, order_by, filter_by}
  );
  const warehouses = response.data?.WAREHOUSES.map((node: any) => {
    return {
      WAREHOUSE_NAME: node.WAREHOUSE_NAME,
      WAREHOUSE_SIZE: node.WAREHOUSE_SIZE,
      CLUSTERS: node.MIN_CLUSTER + '-' + node.MAX_CLUSTER,
      AUTO_SUSPEND: node.AUTO_SUSPEND,
      QUERY_CREDIT: node.QUERY_CREDIT,
      COST_HISTORY: node.COST_HISTORY,
      UTILIZATION: node.UTILIZATION
    }
  });

  return warehouses || [];
}

export function createWarehouseDataSource() {
  return {
    getRows: (params: any) => {
      const { startRow, endRow } = params.request;

      //server side pagination
      const limit = endRow - startRow;
      const offset = startRow;

      //server side sorting
      const order_by: { [key: string]: string } = {};
      params.request.sortModel.forEach((item: any) => {
        order_by[item.colId] = item.sort.toLowerCase();
      });

      // server side filtering
      const filter_by: { [key: string]: { [type: string]: string } } = {};
      Object.entries(params.request.filterModel).forEach(([key, value]) => {
        const { type, filter } = value as FilterModel;
        filter_by[key] = { [type]: filter };
      });

      const response = fetchWarehouses(limit, offset, order_by, filter_by).then((response) => {
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
    WAREHOUSES_aggregate {
      aggregate {
        count
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
    return response.data?.WAREHOUSES_aggregate.aggregate?.count || 0;
  }).catch((error) => {
    console.error(error);
    return 0; 
  })
}



