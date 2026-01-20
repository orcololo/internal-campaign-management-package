-- Add new enums for engagement and AI tracking
DO $$ BEGIN
  CREATE TYPE engagement_trend AS ENUM ('CRESCENTE', 'ESTAVEL', 'DECRESCENTE', 'NAO_DEFINIDO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE household_type AS ENUM ('SOLTEIRO', 'FAMILIA_COM_FILHOS', 'FAMILIA_SEM_FILHOS', 'IDOSOS', 'ESTUDANTES', 'NAO_INFORMADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE employment_status AS ENUM ('EMPREGADO', 'DESEMPREGADO', 'APOSENTADO', 'ESTUDANTE', 'AUTONOMO', 'NAO_INFORMADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE turnout_likelihood AS ENUM ('ALTO', 'MEDIO', 'BAIXO', 'NAO_DEFINIDO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE communication_style AS ENUM ('FORMAL', 'INFORMAL', 'NAO_DEFINIDO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE community_role AS ENUM ('LIDER', 'MEMBRO_ATIVO', 'ATIVISTA', 'MEMBRO', 'NAO_PARTICIPANTE', 'NAO_DEFINIDO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE volunteer_status AS ENUM ('ATIVO', 'INATIVO', 'INTERESSADO', 'NAO_VOLUNTARIO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to voters table
ALTER TABLE voters ADD COLUMN IF NOT EXISTS top_issues TEXT;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS issue_positions TEXT;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS previous_candidate_support TEXT;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS influencer_score INTEGER;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS persuadability VARCHAR(20);
ALTER TABLE voters ADD COLUMN IF NOT EXISTS turnout_likelihood turnout_likelihood DEFAULT 'NAO_DEFINIDO';

-- Engagement & Behavioral fields
ALTER TABLE voters ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS last_engagement_date TIMESTAMP;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS engagement_trend engagement_trend DEFAULT 'NAO_DEFINIDO';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS seasonal_activity TEXT;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS contact_frequency INTEGER;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS response_rate INTEGER;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS event_attendance TEXT;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS volunteer_status volunteer_status DEFAULT 'NAO_VOLUNTARIO';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS donation_history TEXT;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS engagement_score INTEGER;

-- Demographics Extended fields
ALTER TABLE voters ADD COLUMN IF NOT EXISTS age_group VARCHAR(20);
ALTER TABLE voters ADD COLUMN IF NOT EXISTS household_type household_type DEFAULT 'NAO_INFORMADO';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS employment_status employment_status DEFAULT 'NAO_INFORMADO';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS vehicle_ownership VARCHAR(3) DEFAULT 'NAO';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS internet_access VARCHAR(100);

-- Communication Preferences Extended fields
ALTER TABLE voters ADD COLUMN IF NOT EXISTS communication_style communication_style DEFAULT 'NAO_DEFINIDO';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS content_preference TEXT;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS best_contact_time VARCHAR(50);
ALTER TABLE voters ADD COLUMN IF NOT EXISTS best_contact_day TEXT;

-- Social Network & Influence fields
ALTER TABLE voters ADD COLUMN IF NOT EXISTS social_media_followers INTEGER;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS community_role community_role DEFAULT 'NAO_DEFINIDO';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS referred_voters INTEGER DEFAULT 0;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS network_size INTEGER;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS influence_radius REAL;

-- Add indexes for frequently queried AI/engagement fields
CREATE INDEX IF NOT EXISTS idx_voters_engagement_score ON voters(engagement_score);
CREATE INDEX IF NOT EXISTS idx_voters_influencer_score ON voters(influencer_score);
CREATE INDEX IF NOT EXISTS idx_voters_turnout_likelihood ON voters(turnout_likelihood);
CREATE INDEX IF NOT EXISTS idx_voters_engagement_trend ON voters(engagement_trend);
CREATE INDEX IF NOT EXISTS idx_voters_community_role ON voters(community_role);
CREATE INDEX IF NOT EXISTS idx_voters_volunteer_status ON voters(volunteer_status);
CREATE INDEX IF NOT EXISTS idx_voters_last_engagement_date ON voters(last_engagement_date);

-- Add comments to document the new fields
COMMENT ON COLUMN voters.top_issues IS 'JSON array of issues the voter cares about most';
COMMENT ON COLUMN voters.issue_positions IS 'JSON object with the voter stance on specific issues';
COMMENT ON COLUMN voters.influencer_score IS 'Score from 0-100 indicating likelihood to influence others';
COMMENT ON COLUMN voters.persuadability IS 'How likely the voter is to change their vote (ALTO/MEDIO/BAIXO)';
COMMENT ON COLUMN voters.turnout_likelihood IS 'Probability the voter will actually vote';
COMMENT ON COLUMN voters.engagement_score IS 'Calculated score from 0-100 based on all interactions';
COMMENT ON COLUMN voters.seasonal_activity IS 'JSON object with activity patterns by month/season';
COMMENT ON COLUMN voters.event_attendance IS 'JSON array of events attended';
COMMENT ON COLUMN voters.donation_history IS 'JSON array of donation records';
COMMENT ON COLUMN voters.content_preference IS 'JSON array of preferred content types (video, texto, imagens)';
COMMENT ON COLUMN voters.best_contact_day IS 'JSON array of preferred contact days';
