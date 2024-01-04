CREATE OR REPLACE VIEW BLUESKY_DP0.BLSWEB.warehouses AS (
  WITH util AS (
    SELECT 
      SUM(QUERY_CREDIT) AS QUERY_CREDIT, 
      SUM(IDLE_CREDIT) AS IDLE_CREDIT, 
      WAREHOUSE_NAME, 
      SUM(QUERY_CREDIT+IDLE_CREDIT) AS TOTAL, 
      MAX(TIME_DAY) AS TIME_DAY
    FROM BLUESKY_DP0.PUBLIC.DERIVED_REAL_IDLE_BY_DAY
    WHERE TIME_DAY <= '2024-01-02' 
    AND TIME_DAY >= '2023-11-01'
    GROUP BY WAREHOUSE_NAME
  ),
  anomaly AS (
    SELECT 
    REPLACE(ROOT_CAUSE_ENTITY, '"') AS ROOT_CAUSE_ENTITY, 
    MAX(est_annual_saving_credit) AS annual_wASte_credits,
    MAX(CASE
      WHEN EST_ANNUAL_SAVING_USD is NULL THEN EST_ANNUAL_SAVING_CREDIT * 2.88
      ELSE EST_ANNUAL_SAVING_USD
      END
    ) AS annual_wASte_usd,
    ARRAY_AGG(finding_id) AS finding_ids,
    ARRAY_AGG(category) AS categories,
    false AS behind_paywall
    FROM BLUESKY_DP0.PUBLIC.DERIVED_OPTIMIZATION_FINDINGS_LATEST
    GROUP by root_cause_entity 
    HAVING ANNUAL_WASTE_USD > 0 
  ),
  real_idle AS (
    SELECT
      warehouse_name AS wh,
      SUM(query_credit) AS total_query_credits,
      SUM(overall_compute_credit) AS total_compute_credits,
      array_agg(credits_used_total) WITHIN group (ORDER BY time_day) AS cost_history
    FROM BLUESKY_DP0.PUBLIC.DERIVED_REAL_IDLE_BY_DAY 
    WHERE TIME_DAY <= '2024-01-02' 
    AND TIME_DAY >= '2023-11-01'
    GROUP BY wh
  )
  select 
    DISTINCT(WAREHOUSE_NAME), 
    WAREHOUSE_SIZE, 
    WAREHOUSE_TYPE, 
    MIN_CLUSTER, 
    MAX_CLUSTER, 
    AUTO_SUSPEND, 
    SCALING_POLICY, 
    TOTAL, 
    IDLE_CREDIT, 
    QUERY_CREDIT, 
    behind_paywall, 
    FINDING_IDS, 
    CATEGORIES, 
    ANNUAL_WASTE_USD, 
    cost_history,
    total_query_credits / (total_compute_credits+0.01) AS utilization
  FROM BLUESKY_DP0.PUBLIC.WAREHOUSE_SETTINGS
  LEFT JOIN util 
  USING(WAREHOUSE_NAME) 
  LEFT JOIN anomaly 
  ON ( WAREHOUSE_NAME = ROOT_CAUSE_ENTITY)
  LEFT JOIN real_idle 
  ON warehouse_name = real_idle.wh
  WHERE TO_DATE(INGESTED_AT) = (
    SELECT TO_DATE(MAX(INGESTED_AT)) 
    FROM BLUESKY_DP0.PUBLIC.WAREHOUSE_SETTINGS
  )
  ORDER BY QUERY_CREDIT DESC nulls LAST  
  limit 50 offset 0
)
