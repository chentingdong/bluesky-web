-- CREATE wide fact table for daily warehouse
CREATE OR REPLACE TABLE BLUESKY_DP0.BLSWEB.DERIVED_REAL_IDLE_BY_DAY AS (
  SELECT 
    WAREHOUSE_NAME,
    MAX(TIME_DAY) AS TIME_DAY,
    SUM(QUERY_CREDIT) AS QUERY_CREDIT,
    SUM(IDLE_CREDIT) AS IDLE_CREDIT,
    SUM(OVERALL_COMPUTE_CREDIT) AS TOTAL_COMPUTE_CREDIT,
    SUM(QUERY_CREDIT+IDLE_CREDIT) AS TOTAL,
    array_agg(credits_used_total) WITHIN group (ORDER BY time_day) AS COST_HISTORY
  FROM BLUESKY_DP0.PUBLIC.DERIVED_REAL_IDLE_BY_DAY
  GROUP BY WAREHOUSE_NAME, TIME_DAY
  HAVING TOTAL > 0
  ORDER BY WAREHOUSE_NAME ASC, TIME_DAY DESC
);
-- CREATE dimension table for warehouse anomaly
CREATE OR REPLACE TABLE BLUESKY_DP0.BLSWEB.WAREHOUSE_ANOMALY AS (
  with anomaly AS (
    SELECT 
      REPLACE(ROOT_CAUSE_ENTITY, '"') AS ROOT_CAUSE_ENTITY, 
      MAX(est_annual_saving_credit) AS ANNUAL_WASTE_CREDIT,
      MAX(CASE
        WHEN EST_ANNUAL_SAVING_USD is NULL THEN EST_ANNUAL_SAVING_CREDIT * 2.88
        ELSE EST_ANNUAL_SAVING_USD
        END
      ) AS ANNUAL_WASTE_USD,
      ARRAY_AGG(finding_id) AS finding_ids,
      ARRAY_AGG(category) AS categories,
      false AS behind_paywall
    FROM BLUESKY_DP0.PUBLIC.DERIVED_OPTIMIZATION_FINDINGS_LATEST
    GROUP by root_cause_entity 
    HAVING ANNUAL_WASTE_USD > 0
  ),
  wh_settings AS (
    SELECT 
      DISTINCT(WAREHOUSE_NAME) WAREHOUSE_NAME, 
      WAREHOUSE_SIZE,
      WAREHOUSE_TYPE, 
      MIN_CLUSTER, 
      MAX_CLUSTER, 
      AUTO_SUSPEND, 
      SCALING_POLICY,
      INGESTED_AT
    FROM BLUESKY_DP0.PUBLIC.WAREHOUSE_SETTINGS
    WHERE TO_DATE(INGESTED_AT) = (
      SELECT TO_DATE(MAX(INGESTED_AT)) 
      FROM BLUESKY_DP0.PUBLIC.WAREHOUSE_SETTINGS
    )
  )
  SELECT * FROM WH_SETTINGS
  LEFT JOIN ANOMALY ON WH_SETTINGS.WAREHOUSE_NAME = ANOMALY.ROOT_CAUSE_ENTITY
);

-- Do the join in graphql
select 
  WAREHOUSE.WAREHOUSE_NAME AS WAREHOUSE_NAME, 
  WAREHOUSE_SIZE, 
  WAREHOUSE_TYPE, 
  MIN_CLUSTER, 
  MAX_CLUSTER, 
  AUTO_SUSPEND, 
  SCALING_POLICY,
  FINDING_IDS, 
  CATEGORIES, 
  ANNUAL_WASTE_USD,
  ANY_VALUE(COST_HISTORY) AS COST_HISTORY,
  MAX(INGESTED_AT) AS INGESTED_AT,
  SUM(QUERY_CREDIT) AS QUERY_CREDIT,
  SUM(IDLE_CREDIT) AS IDLE_CREDIT,
  SUM(TOTAL_COMPUTE_CREDIT) AS TOTAL_COMPUTE_CREDITS,
  SUM(QUERY_CREDIT+IDLE_CREDIT) AS TOTAL_QUERY_CREDITS,
  TOTAL_QUERY_CREDITS / (TOTAL_COMPUTE_CREDITS+0.01) AS UTILIZATION
FROM BLUESKY_DP0.BLSWEB.DERIVED_REAL_IDLE_BY_DAY AS WAREHOUSE
LEFT JOIN BLUESKY_DP0.BLSWEB.WAREHOUSE_ANOMALY AS DIM
ON WAREHOUSE.WAREHOUSE_NAME = DIM.ROOT_CAUSE_ENTITY
WHERE TIME_DAY >= '2023-11-01'
AND TIME_DAY <= '2024-01-02'
GROUP BY WAREHOUSE.WAREHOUSE_NAME, WAREHOUSE_SIZE, FINDING_IDS, WAREHOUSE_TYPE, WAREHOUSE_SIZE, MIN_CLUSTER, MAX_CLUSTER, AUTO_SUSPEND, SCALING_POLICY, CATEGORIES,ANNUAL_WASTE_USD
ORDER BY WAREHOUSE_NAME ASC;

select * from BLUESKY_DP0.BLSWEB.DERIVED_REAL_IDLE_BY_DAY;
select * from BLUESKY_DP0.BLSWEB.WAREHOUSE_ANOMALY;