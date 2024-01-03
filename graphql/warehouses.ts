import { fetchGraphQL } from './client';

const operationsDoc = `
  query Warehouses($limit: Int!, $offset: Int!) {
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
    operationsDoc,
    "Warehouses",
    {limit, offset}
  );
  return response.data?.WAREHOUSES || [];
}
