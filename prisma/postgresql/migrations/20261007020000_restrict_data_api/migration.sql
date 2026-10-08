-- Prisma uses a trusted server-side PostgreSQL connection.
-- None of the CMS tables should be exposed through Supabase's anonymous Data API.
-- Existing grants for other database schemas and tables are not modified.
DO $$
DECLARE
  item text;
  schema_name text := current_schema();
BEGIN
  FOREACH item IN ARRAY ARRAY[
    'User', 'Session', 'SiteSettings', 'HeroContent', 'ServiceCard', 'PracticeArea',
    'AccountRecoveryType', 'RecoveryContent', 'WhatsAppClick', 'RateLimitBucket',
    'AboutContent', 'AuthorityStat', 'HowItWorksStep', 'CtaFinalContent', 'FaqItem',
    'BlogPost', 'Testimonial', 'Lead', 'MediaFile', 'LegalPage', 'SeoSettings', 'AuditLog',
    '_prisma_migrations'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', schema_name, item);
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE format('REVOKE ALL ON TABLE %I.%I FROM anon', schema_name, item);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE format('REVOKE ALL ON TABLE %I.%I FROM authenticated', schema_name, item);
    END IF;
  END LOOP;
END $$;
