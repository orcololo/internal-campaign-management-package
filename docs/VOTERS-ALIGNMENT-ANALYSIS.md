# Frontend-Backend Alignment Analysis - Voters Module

**Date:** 12 de janeiro de 2026  
**Status:** ⚠️ Partially Aligned - Referral System Missing in Backend

---

## 📊 Overview

The voters API and frontend are **mostly aligned** but have **one critical missing feature** in the backend: the **Referral System**.

---

## ✅ What's Already Aligned

### 1. **Core CRUD Operations** ✅
| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Create voter | ✅ | ✅ POST `/voters` | ✅ Aligned |
| List voters | ✅ | ✅ GET `/voters` | ✅ Aligned |
| Get single voter | ✅ | ✅ GET `/voters/:id` | ✅ Aligned |
| Update voter | ✅ | ✅ PATCH `/voters/:id` | ✅ Aligned |
| Delete voter | ✅ | ✅ DELETE `/voters/:id` | ✅ Aligned |

---

### 2. **Bulk Operations** ✅
| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Bulk delete | ✅ | ✅ POST `/voters/bulk/delete` | ✅ Aligned |
| Bulk update | ✅ | ✅ PATCH `/voters/bulk/update` | ✅ Aligned |

---

### 3. **Location Features** ✅
| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Geocode address | ✅ | ✅ POST `/voters/:id/geocode` | ✅ Aligned |
| Find nearby voters | ✅ | ✅ GET `/voters/location/nearby` | ✅ Aligned |
| Geofence filtering | ✅ | ✅ POST `/voters/location/geofence` | ✅ Aligned |
| Group by proximity | ✅ | ✅ POST `/voters/location/group-by-proximity` | ✅ Aligned |
| Batch geocode | ✅ | ✅ POST `/voters/location/batch-geocode` | ✅ Aligned |

---

### 4. **Import/Export** ✅
| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Import CSV | ✅ | ✅ POST `/voters/import/csv` | ✅ Aligned |
| Export CSV | ✅ | ✅ GET `/voters/export/csv` | ✅ Aligned |

---

### 5. **Analytics** ✅
| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Get statistics | ✅ | ✅ GET `/voters/statistics` | ✅ Aligned |

---

### 6. **Data Model - Core Fields** ✅

All core voter fields are aligned between frontend and backend:

**Basic Info:**
- ✅ name, cpf, dateOfBirth, gender

**Contact:**
- ✅ phone, whatsapp, email

**Address:**
- ✅ address, addressNumber, addressComplement, neighborhood, city, state, zipCode
- ✅ latitude, longitude

**Electoral:**
- ✅ electoralTitle, electoralZone, electoralSection, votingLocation

**Social:**
- ✅ educationLevel, occupation, incomeLevel, maritalStatus, religion, ethnicity

**Political:**
- ✅ supportLevel, politicalParty, votingHistory, topIssues, issuePositions
- ✅ influencerScore, persuadability, turnoutLikelihood

**Engagement:**
- ✅ registrationDate, lastEngagementDate, engagementTrend
- ✅ contactFrequency, responseRate, eventAttendance
- ✅ volunteerStatus, donationHistory, engagementScore

**Demographics Extended:**
- ✅ ageGroup, householdType, employmentStatus, vehicleOwnership, internetAccess

**Communication Preferences:**
- ✅ communicationStyle, contentPreference, bestContactTime, bestContactDay

**Social Network:**
- ✅ socialMediaFollowers, communityRole, networkSize, influenceRadius

**Misc:**
- ✅ tags, notes, hasWhatsapp, preferredContact

---

## ❌ What's Missing in Backend

### **Critical: Referral System** 🚨

The frontend has a complete **Referral System** implementation, but it's **completely missing from the backend**.

#### Frontend Has:
- ✅ Referral page: `/voters/[id]/referrals`
- ✅ Components:
  - `ReferralsStats` - Display referral statistics
  - `ReferralLinkGenerator` - Generate unique referral links
  - `ReferralsList` - List of referred voters
  - `VoterDetail` - Shows referral info

#### Frontend Data Model:
```typescript
interface ReferralStats {
  total: number;
  active: number;
  thisMonth: number;
  byLevel: Record<SupportLevel, number>;
}

interface Voter {
  // ... other fields
  
  // Referral System
  referralCode: string;          // Unique code (e.g., "JOAO-SILVA-ABC123")
  referredBy?: string;           // ID of referrer voter
  referralDate?: string;         // Date referred
  referralStats: ReferralStats;  // Referral statistics
}
```

#### Backend Has:
- ❌ No `referralCode` field in schema
- ❌ No `referredBy` field in schema
- ❌ No `referralDate` field in schema
- ❌ No `referralStats` (but has `referredVoters` count)
- ❌ No endpoints:
  - `GET /voters/:id/referrals` - List referrals
  - `POST /voters/:id/referral-link` - Generate link
  - `POST /voters/register-referral` - Register new referral
  - `GET /voters/:id/referral-stats` - Get statistics

---

## 🔧 Required Backend Changes

### 1. **Database Schema Update**

Add to `voter.schema.ts`:

```typescript
export const voters = pgTable('voters', {
  // ... existing fields
  
  // Referral System
  referralCode: varchar('referral_code', { length: 50 }).unique(), // JOAO-SILVA-ABC123
  referredBy: uuid('referred_by').references(() => voters.id), // Self-reference
  referralDate: timestamp('referral_date'),
  
  // Note: referralStats is computed, not stored
});
```

### 2. **Database Migration**

Create `0005_add_referral_fields.sql`:

```sql
-- Add referral system fields
ALTER TABLE voters 
  ADD COLUMN referral_code VARCHAR(50) UNIQUE,
  ADD COLUMN referred_by UUID REFERENCES voters(id) ON DELETE SET NULL,
  ADD COLUMN referral_date TIMESTAMP;

-- Index for performance
CREATE INDEX idx_voters_referral_code ON voters(referral_code);
CREATE INDEX idx_voters_referred_by ON voters(referred_by);

-- Generate referral codes for existing voters
UPDATE voters 
SET referral_code = UPPER(
  REPLACE(SUBSTRING(name FROM 1 FOR 10), ' ', '-') || '-' || 
  SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)
)
WHERE referral_code IS NULL;
```

### 3. **New DTOs**

Create `dto/referral.dto.ts`:

```typescript
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateReferralDto {
  @IsString()
  referralCode: string;
  
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  email?: string;
  
  @IsOptional()
  @IsString()
  phone?: string;
  
  // ... other basic voter fields
}

export class ReferralStatsDto {
  total: number;
  active: number;
  thisMonth: number;
  byLevel: Record<string, number>;
}
```

### 4. **Service Methods**

Add to `voters.service.ts`:

```typescript
/**
 * Generate unique referral code for voter
 */
async generateReferralCode(voterId: string): Promise<string> {
  const voter = await this.findOne(voterId);
  if (voter.referralCode) {
    return voter.referralCode;
  }
  
  const code = this.createReferralCode(voter.name);
  await this.update(voterId, { referralCode: code });
  return code;
}

/**
 * Get list of voters referred by this voter
 */
async getReferrals(voterId: string): Promise<Voter[]> {
  return this.db
    .select()
    .from(voters)
    .where(eq(voters.referredBy, voterId));
}

/**
 * Get referral statistics
 */
async getReferralStats(voterId: string): Promise<ReferralStatsDto> {
  const referrals = await this.getReferrals(voterId);
  
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    total: referrals.length,
    active: referrals.filter(r => !r.deletedAt).length,
    thisMonth: referrals.filter(r => 
      r.referralDate && r.referralDate >= firstDayOfMonth
    ).length,
    byLevel: referrals.reduce((acc, r) => {
      const level = r.supportLevel || 'NAO_DEFINIDO';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Register new voter via referral
 */
async registerReferral(
  referralCode: string,
  data: CreateReferralDto
): Promise<Voter> {
  // Find referrer by code
  const [referrer] = await this.db
    .select()
    .from(voters)
    .where(eq(voters.referralCode, referralCode));
  
  if (!referrer) {
    throw new NotFoundException('Invalid referral code');
  }
  
  // Create new voter with referral link
  const newVoter = await this.create({
    ...data,
    referredBy: referrer.id,
    referralDate: new Date(),
  });
  
  // Increment referrer's count
  await this.db
    .update(voters)
    .set({ 
      referredVoters: sql`${voters.referredVoters} + 1` 
    })
    .where(eq(voters.id, referrer.id));
  
  return newVoter;
}

/**
 * Create unique referral code
 */
private createReferralCode(name: string): string {
  const slug = name
    .substring(0, 10)
    .toUpperCase()
    .replace(/[^A-Z]/g, '-');
  
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `${slug}-${random}`;
}
```

### 5. **Controller Endpoints**

Add to `voters.controller.ts`:

```typescript
@Get(':id/referrals')
@Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
@ApiOperation({ summary: 'Get list of voters referred by this voter' })
async getReferrals(@Param('id') id: string) {
  return this.votersService.getReferrals(id);
}

@Get(':id/referral-stats')
@Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA, UserRole.ESCRITORIO)
@ApiOperation({ summary: 'Get referral statistics for voter' })
async getReferralStats(@Param('id') id: string) {
  return this.votersService.getReferralStats(id);
}

@Post(':id/referral-code')
@Roles(UserRole.CANDIDATO, UserRole.ESTRATEGISTA, UserRole.LIDERANCA)
@ApiOperation({ summary: 'Generate or get referral code for voter' })
async generateReferralCode(@Param('id') id: string) {
  const code = await this.votersService.generateReferralCode(id);
  return { referralCode: code };
}

@Post('register-referral')
@ApiOperation({ summary: 'Register new voter via referral code (public endpoint)' })
@ApiResponse({ status: 201, description: 'Voter created via referral' })
@ApiResponse({ status: 404, description: 'Invalid referral code' })
async registerReferral(@Body() dto: CreateReferralDto) {
  return this.votersService.registerReferral(dto.referralCode, dto);
}
```

---

## 📋 Implementation Checklist

To fully align the backend with the frontend:

- [ ] Create migration `0005_add_referral_fields.sql`
- [ ] Run migration to add referral columns
- [ ] Update `voter.schema.ts` with referral fields
- [ ] Create `dto/referral.dto.ts`
- [ ] Add referral methods to `voters.service.ts`:
  - [ ] `generateReferralCode()`
  - [ ] `getReferrals()`
  - [ ] `getReferralStats()`
  - [ ] `registerReferral()`
- [ ] Add referral endpoints to `voters.controller.ts`:
  - [ ] `GET /voters/:id/referrals`
  - [ ] `GET /voters/:id/referral-stats`
  - [ ] `POST /voters/:id/referral-code`
  - [ ] `POST /voters/register-referral`
- [ ] Update frontend API client to use real endpoints
- [ ] Test referral flow end-to-end
- [ ] Update frontend to remove mock data for referrals

---

## 🎯 Priority

**Priority: HIGH** ⚠️

The referral system is already fully implemented in the frontend with:
- Dedicated page (`/voters/[id]/referrals`)
- 3 custom components
- Complete UI/UX flow
- Mock data ready

Users can see the interface but it won't work with real data until backend is implemented.

---

## ⏱️ Estimated Implementation Time

- **Migration:** 30 minutes
- **Schema update:** 15 minutes
- **DTOs:** 30 minutes
- **Service methods:** 2 hours
- **Controller endpoints:** 1 hour
- **Testing:** 1 hour
- **Frontend integration:** 30 minutes

**Total: ~5-6 hours**

---

## 📊 Summary

### Alignment Score: 90% ✅

| Category | Status | Notes |
|----------|--------|-------|
| Core CRUD | ✅ 100% | All operations working |
| Bulk Operations | ✅ 100% | Delete and update working |
| Location Features | ✅ 100% | All 5 endpoints present |
| Import/Export | ✅ 100% | CSV working |
| Analytics | ✅ 100% | Statistics endpoint present |
| Data Model | ✅ 95% | Only referral fields missing |
| **Referral System** | ❌ 0% | **Completely missing in backend** |

---

## 🚀 Recommendation

**Implement the referral system backend as part of Week 2 or 3.**

Since the frontend is already complete and the feature is visually exposed to users, implementing the backend should be prioritized to avoid confusion.

The referral system could be a powerful feature for campaign growth, allowing voters to invite others and tracking viral coefficients.

---

**Next Steps:** 
1. Review this analysis
2. Decide priority for referral system implementation
3. If approved, implement in Week 2 (after core reports system)
