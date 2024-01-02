import { fetchGraphQL } from './client';

const operationsDoc = `
  query Warehouses {
    WAREHOUSES(where: {}) {
      WAREHOUSE_SIZE
      WAREHOUSE_NAME
      AUTO_SUSPEND
      QUERY_CREDIT
      COST_HISTORY
      UTILIZATION
    }
  }
`;

export async function fetchWarehouses() {
  const response = await fetchGraphQL(
    operationsDoc,
    "Warehouses",
    {}
  );
  return response.data.WAREHOUSES;
}

