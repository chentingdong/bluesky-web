import { fetchGraphQL } from './client';

const operationsDocData = `
  query Warehouses(
    $limit: Int!, 
    $offset: Int!,
    $order_by: [WAREHOUSES_order_by!]
  ) @cached {
    WAREHOUSES(
      limit: $limit
      offset: $offset
      order_by: $order_by
    ) {
      WAREHOUSE_SIZE
      WAREHOUSE_NAME
      AUTO_SUSPEND
      QUERY_CREDIT
      COST_HISTORY
      UTILIZATION
    }
  }
`;

export async function fetchWarehouses(limit: number, offset: number, order_by: any) {
  const response = await fetchGraphQL(
    operationsDocData,
    "Warehouses",
    {limit, offset, order_by}
  );
  return response.data?.WAREHOUSES || [];
}

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
  });
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
      
      const response = fetchWarehouses(limit, offset, order_by).then((response) => {  
        params.success({
          rowData: response,
          rowCount: fetchWarehouseCount()
        });
      });
      
      return response;
    }
  }
}