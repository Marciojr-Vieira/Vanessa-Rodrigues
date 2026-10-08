CREATE TABLE "ServiceHeartbeat" (
  "id" TEXT NOT NULL,
  "lastSentAt" TIMESTAMP(3),
  "source" TEXT NOT NULL DEFAULT 'netlify',
  "runs" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ServiceHeartbeat_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ServiceHeartbeat_runs_nonnegative" CHECK ("runs" >= 0)
);

ALTER TABLE "ServiceHeartbeat" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "ServiceHeartbeat" FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE format('REVOKE ALL ON TABLE %I.%I FROM anon', current_schema(), 'ServiceHeartbeat');
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE format('REVOKE ALL ON TABLE %I.%I FROM authenticated', current_schema(), 'ServiceHeartbeat');
  END IF;
END $$;
