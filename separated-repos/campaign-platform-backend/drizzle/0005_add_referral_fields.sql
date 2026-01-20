-- Migration: Add referral system to voters
-- Author: AI Implementation
-- Date: 2026-01-12
-- Description: Add referral tracking fields to enable voter-to-voter referral system

-- Add referral system columns
ALTER TABLE voters 
  ADD COLUMN referral_code VARCHAR(50) UNIQUE,
  ADD COLUMN referred_by UUID REFERENCES voters(id) ON DELETE SET NULL,
  ADD COLUMN referral_date TIMESTAMP;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_voters_referral_code ON voters(referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_voters_referred_by ON voters(referred_by) WHERE referred_by IS NOT NULL;

-- Generate referral codes for existing voters
-- Format: FIRSTNAME-LASTNAME-RANDOM (e.g., JOAO-SILVA-AB12CD)
UPDATE voters 
SET referral_code = UPPER(
  CONCAT(
    -- Take first part of name (up to 10 chars), replace spaces with hyphens
    SUBSTRING(REPLACE(name, ' ', '-') FROM 1 FOR 15),
    '-',
    -- Add 6 random characters
    SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT) FROM 1 FOR 6)
  )
)
WHERE referral_code IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN voters.referral_code IS 'Unique referral code for this voter (e.g., JOAO-SILVA-AB12CD)';
COMMENT ON COLUMN voters.referred_by IS 'UUID of the voter who referred this person';
COMMENT ON COLUMN voters.referral_date IS 'Date when this voter was referred by another voter';
