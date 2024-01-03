import { fetchGraphQL } from './client';

const operationsDocData = `
  query Warehouses($limit: Int!, $offset: Int!) @cached {
    WAREHOUSES(
      limit: $limit
      offset: $offset
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

export async function fetchWarehouses(limit: number, offset: number) {
  const response = await fetchGraphQL(
    operationsDocData,
    "Warehouses",
    {limit, offset}
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
      const limit = endRow - startRow;
      const offset = startRow;
      const response = fetchWarehouses(limit, offset).then((response) => {  
        params.success({
          rowData: response,
          rowCount: fetchWarehouseCount()
        });
      });
      return response;
    }
  }
}