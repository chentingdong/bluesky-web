export async function fetchGraphQL(operationsDoc: string, operationName: string, variables: any) {
  const result = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: "POST",
      headers: {
        'x-hasura-admin-secret': '7F9A2172-A9D5-4E61-B14B-0D826CDF225A',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}
