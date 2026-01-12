# Voter Data Model Enhancement - AI & Engagement Fields

## Summary

Added comprehensive voter tracking fields to enable AI-powered insights and advanced campaign analytics.

## New Fields Added (50+ fields)

### 1. Political Information Extended

- `topIssues` - Array of issues voter cares about (Educação, Saúde, Segurança, etc.)
- `issuePositions` - Voter's stance on specific issues
- `previousCandidateSupport` - Historical candidate support
- `influencerScore` - 0-100 score for influence potential
- `persuadability` - ALTO/MEDIO/BAIXO likelihood to change vote
- `turnoutLikelihood` - ALTO/MEDIO/BAIXO probability of voting

### 2. Engagement & Behavioral Tracking

- `registrationDate` - When they joined the database
- `lastEngagementDate` - Last meaningful interaction
- `engagementTrend` - CRESCENTE/ESTAVEL/DECRESCENTE
- `seasonalActivity` - JSON patterns by month
- `lastContactDate` - Last contact timestamp
- `contactFrequency` - Number of times contacted
- `responseRate` - Percentage 0-100 of responses
- `eventAttendance` - Array of events attended
- `volunteerStatus` - ATIVO/INATIVO/INTERESSADO/NAO_VOLUNTARIO
- `donationHistory` - Array of donation records
- `engagementScore` - Calculated 0-100 engagement score

### 3. Demographics Extended

- `ageGroup` - 18-25, 26-35, 36-50, 51-65, 65+
- `householdType` - SOLTEIRO/FAMILIA_COM_FILHOS/etc.
- `employmentStatus` - EMPREGADO/DESEMPREGADO/APOSENTADO/etc.
- `vehicleOwnership` - Boolean for vehicle access
- `internetAccess` - Fibra/4G/3G/Limitado/Sem acesso

### 4. Communication Preferences Extended

- `communicationStyle` - FORMAL/INFORMAL
- `contentPreference` - Array: video, texto, imagens, audio
- `bestContactTime` - Manhã/Tarde/Noite
- `bestContactDay` - Array of weekdays

### 5. Social Network & Influence

- `socialMediaFollowers` - Total estimated followers
- `communityRole` - LIDER/MEMBRO_ATIVO/ATIVISTA/etc.
- `referredVoters` - Number of voters they brought
- `networkSize` - Estimated personal network size
- `influenceRadius` - Geographic influence area in km

## Files Modified

### Backend

1. **apps/api/src/database/schemas/voter.schema.ts**

   - Added 8 new enum types
   - Added 50+ new columns
   - Exported new TypeScript types

2. **apps/api/drizzle/0003_add_ai_engagement_fields.sql**
   - Migration script to add all new fields
   - Added indexes for performance
   - Added field documentation comments

### Frontend

1. **apps/web/types/voters.ts**

   - Added 9 new TypeScript enums
   - Extended Voter interface with 50+ fields

2. **apps/web/lib/validators/voters.ts**

   - Added 9 new Zod enum schemas
   - Created `voterEngagementSchema` for Step 7
   - Exported `VoterEngagement` type

3. **apps/web/mock-data/voters.ts**

   - Imported new enum types
   - Added constants for all new field options
   - Updated `generateVoter()` to populate all new fields
   - All 200 mock voters now include AI-relevant data

4. **apps/web/components/features/voters/voter-form.tsx**
   - Added Step 6: "Engajamento & IA"
   - Created `engagementForm` with full validation
   - Added 40+ form fields across 5 sections:
     - Demografia Estendida
     - Preferências de Comunicação
     - Informações Políticas Estendidas
     - Rede Social & Influência
     - Rastreamento de Engajamento

## Usage Example

### Creating a voter with AI fields:

```typescript
const newVoter = {
  // Basic fields...
  name: "João Silva",

  // AI/Engagement fields
  engagementScore: 85,
  influencerScore: 72,
  turnoutLikelihood: "ALTO",
  persuadability: "BAIXO",
  topIssues: ["Saúde", "Educação", "Segurança"],
  communityRole: "LIDER",
  socialMediaFollowers: 2500,
  networkSize: 350,
  influenceRadius: 5.5,
  engagementTrend: "CRESCENTE",
  volunteerStatus: "ATIVO",
  responseRate: 90,
  contactFrequency: 12,
};
```

### Querying for AI insights:

```typescript
// Find high-influence voters
const influencers = voters.filter(
  (v) => v.influencerScore > 70 && v.communityRole === "LIDER"
);

// Find engaged, persuadable voters
const targets = voters.filter(
  (v) =>
    v.persuadability === "ALTO" &&
    v.engagementScore > 60 &&
    v.turnoutLikelihood === "ALTO"
);

// Find volunteers by region
const regionalVolunteers = voters.filter(
  (v) => v.volunteerStatus === "ATIVO" && v.influenceRadius > 3
);
```

## AI Use Cases Enabled

1. **Predictive Modeling**

   - Turnout prediction based on engagement patterns
   - Vote persuasion probability scoring
   - Optimal contact timing prediction

2. **Network Analysis**

   - Identify key influencers in communities
   - Map social network connections
   - Calculate optimal canvassing routes

3. **Engagement Optimization**

   - Personalize communication style (formal/informal)
   - Optimize content types (video/text/images)
   - Schedule contacts at best times

4. **Segmentation & Targeting**

   - Create micro-segments by demographics + engagement
   - Prioritize high-value, persuadable voters
   - Identify volunteer recruitment targets

5. **Campaign Analytics**
   - Track engagement trends over time
   - Measure volunteer effectiveness
   - Analyze issue-based voter clustering

## Enhanced Analytics Plan Using Voter Schema Fields

This comprehensive analytics plan leverages all 50+ fields from the voter schema to provide actionable insights for campaign management. The plan is organized into 10 key analytics domains, each with specific metrics and query examples.

**Coverage:**
- ✅ All engagement & behavioral tracking fields
- ✅ All political information & persuasion fields
- ✅ All social network & influence fields
- ✅ All extended demographics & communication preferences
- ✅ All volunteer management & event tracking fields
- ✅ Composite scoring and prioritization algorithms
- ✅ Data quality & ML readiness metrics

**Implementation Priority:**
1. **High Priority**: Engagement, Influence, Persuasion analytics (core campaign operations)
2. **Medium Priority**: Volunteer, Communication, Demographics analytics (optimization)
3. **Low Priority**: Seasonal, Predictive analytics (advanced insights)

**Field Mapping Quick Reference:**

| Analytics Domain | Schema Fields Used |
|-----------------|-------------------|
| **Engagement** | `engagementScore`, `engagementTrend`, `responseRate`, `contactFrequency`, `lastEngagementDate`, `lastContactDate` |
| **Influence & Network** | `influencerScore`, `communityRole`, `socialMediaFollowers`, `networkSize`, `influenceRadius`, `referredVoters` |
| **Persuasion & Targeting** | `persuadability`, `turnoutLikelihood`, `supportLevel`, `topIssues`, `issuePositions`, `previousCandidateSupport` |
| **Volunteer Management** | `volunteerStatus`, `donationHistory`, `eventAttendance`, `communityRole` |
| **Communication** | `communicationStyle`, `contentPreference`, `bestContactTime`, `bestContactDay`, `preferredContact` |
| **Demographics Extended** | `ageGroup`, `educationLevel`, `incomeLevel`, `householdType`, `employmentStatus`, `vehicleOwnership`, `internetAccess` |
| **Seasonal & Temporal** | `seasonalActivity`, `registrationDate`, `lastEngagementDate`, `lastContactDate` |
| **Geographic & Spatial** | `latitude`, `longitude`, `influenceRadius`, `neighborhood`, `city`, `state` |

---

### 1. Engagement Analytics

**Key Metrics:**
- `engagementScore` (0-100): Overall engagement health
- `engagementTrend`: Track CRESCENTE/ESTAVEL/DECRESCENTE patterns
- `responseRate` (0-100): How responsive voters are to contact
- `contactFrequency`: Number of successful contacts
- `lastEngagementDate`: Identify dormant voters needing reactivation

**Analytics Queries:**

```typescript
// High-value engaged voters (prime mobilization targets)
const highlyEngaged = voters.filter(v =>
  v.engagementScore >= 70 &&
  v.engagementTrend === 'CRESCENTE' &&
  v.responseRate >= 60
);

// At-risk supporters (engaged but declining)
const atRiskSupporters = voters.filter(v =>
  v.supportLevel === 'FAVORAVEL' &&
  v.engagementTrend === 'DECRESCENTE' &&
  v.engagementScore < 50
);

// Dormant voters needing reactivation
const dormantVoters = voters.filter(v => {
  const daysSinceContact = (Date.now() - v.lastEngagementDate) / (1000 * 60 * 60 * 24);
  return daysSinceContact > 30 && v.supportLevel === 'FAVORAVEL';
});

// Engagement distribution
const engagementDistribution = {
  high: voters.filter(v => v.engagementScore >= 70).length,
  medium: voters.filter(v => v.engagementScore >= 40 && v.engagementScore < 70).length,
  low: voters.filter(v => v.engagementScore < 40).length,
};
```

### 2. Influence & Network Analytics

**Key Metrics:**
- `influencerScore` (0-100): Individual influence potential
- `communityRole`: LIDER/MEMBRO_ATIVO/ATIVISTA hierarchy
- `socialMediaFollowers`: Digital reach
- `networkSize`: Personal network size
- `influenceRadius` (km): Geographic influence area
- `referredVoters`: Actual recruitment success

**Analytics Queries:**

```typescript
// Key influencers (high-priority contacts)
const keyInfluencers = voters.filter(v =>
  v.influencerScore >= 70 &&
  (v.communityRole === 'LIDER' || v.communityRole === 'MEMBRO_ATIVO') &&
  v.networkSize >= 100
);

// Digital influencers (social media strategy)
const digitalInfluencers = voters.filter(v =>
  v.socialMediaFollowers >= 500 &&
  v.supportLevel === 'MUITO_FAVORAVEL'
);

// Network effect analysis
const networkMetrics = {
  totalInfluencers: voters.filter(v => v.influencerScore >= 60).length,
  totalNetworkSize: voters.reduce((sum, v) => sum + (v.networkSize || 0), 0),
  activeRecruiters: voters.filter(v => v.referredVoters > 0).length,
  totalReferred: voters.reduce((sum, v) => sum + (v.referredVoters || 0), 0),
  avgInfluenceRadius: voters.reduce((sum, v) => sum + (v.influenceRadius || 0), 0) / voters.length,
};

// Geographic influence coverage
const influenceByNeighborhood = groupBy(
  voters.filter(v => v.communityRole === 'LIDER'),
  'neighborhood'
);
```

### 3. Persuasion & Targeting Analytics

**Key Metrics:**
- `persuadability`: ALTO/MEDIO/BAIXO conversion potential
- `turnoutLikelihood`: ALTO/MEDIO/BAIXO voting probability
- `supportLevel`: Current support status
- `topIssues`: Issues they care about
- `issuePositions`: Their stance on specific issues

**Analytics Queries:**

```typescript
// Prime targets (persuadable + likely to vote)
const primeTargets = voters.filter(v =>
  v.persuadability === 'ALTO' &&
  v.turnoutLikelihood === 'ALTO' &&
  (v.supportLevel === 'NEUTRO' || v.supportLevel === 'FAVORAVEL')
);

// Get-out-the-vote targets (supporters who might not vote)
const gotvTargets = voters.filter(v =>
  (v.supportLevel === 'FAVORAVEL' || v.supportLevel === 'MUITO_FAVORAVEL') &&
  (v.turnoutLikelihood === 'BAIXO' || v.turnoutLikelihood === 'MEDIO')
);

// Issue-based targeting
const issueSegments = {
  education: voters.filter(v => v.topIssues?.includes('Educação')),
  health: voters.filter(v => v.topIssues?.includes('Saúde')),
  security: voters.filter(v => v.topIssues?.includes('Segurança')),
  infrastructure: voters.filter(v => v.topIssues?.includes('Infraestrutura')),
};

// Persuasion priority matrix
const persuasionMatrix = {
  highPriorityPersuadable: voters.filter(v =>
    v.persuadability === 'ALTO' && v.turnoutLikelihood === 'ALTO'
  ).length,
  mediumPriorityPersuadable: voters.filter(v =>
    v.persuadability === 'MEDIO' && v.turnoutLikelihood === 'ALTO'
  ).length,
  lowPriorityPersuadable: voters.filter(v =>
    v.persuadability === 'BAIXO' || v.turnoutLikelihood === 'BAIXO'
  ).length,
};
```

### 4. Volunteer Management Analytics

**Key Metrics:**
- `volunteerStatus`: ATIVO/INATIVO/INTERESSADO/NAO_VOLUNTARIO
- `donationHistory`: Financial contribution tracking
- `eventAttendance`: Event participation patterns
- `communityRole`: Leadership capacity

**Analytics Queries:**

```typescript
// Active volunteer base
const volunteerMetrics = {
  active: voters.filter(v => v.volunteerStatus === 'ATIVO').length,
  inactive: voters.filter(v => v.volunteerStatus === 'INATIVO').length,
  interested: voters.filter(v => v.volunteerStatus === 'INTERESSADO').length,
  potential: voters.filter(v =>
    v.volunteerStatus === 'NAO_VOLUNTARIO' &&
    v.engagementScore >= 70 &&
    v.supportLevel === 'MUITO_FAVORAVEL'
  ).length,
};

// Volunteer recruitment targets
const volunteerRecruitmentTargets = voters.filter(v =>
  v.volunteerStatus === 'INTERESSADO' &&
  v.engagementScore >= 60 &&
  v.responseRate >= 50
);

// High-capacity volunteers (leadership potential)
const leadershipPotential = voters.filter(v =>
  v.volunteerStatus === 'ATIVO' &&
  v.influencerScore >= 60 &&
  v.communityRole !== 'LIDER'
);

// Event participation analysis
const eventAttendanceMetrics = voters.map(v => ({
  id: v.id,
  name: v.name,
  eventsAttended: v.eventAttendance ? JSON.parse(v.eventAttendance).length : 0,
  volunteerStatus: v.volunteerStatus,
  engagementScore: v.engagementScore,
})).sort((a, b) => b.eventsAttended - a.eventsAttended);
```

### 5. Communication Optimization Analytics

**Key Metrics:**
- `communicationStyle`: FORMAL/INFORMAL preference
- `contentPreference`: video/texto/imagens/audio
- `bestContactTime`: Manhã/Tarde/Noite
- `bestContactDay`: Preferred days of week
- `preferredContact`: TELEFONE/WHATSAPP/EMAIL

**Analytics Queries:**

```typescript
// Communication preferences distribution
const commPreferences = {
  byStyle: {
    formal: voters.filter(v => v.communicationStyle === 'FORMAL').length,
    informal: voters.filter(v => v.communicationStyle === 'INFORMAL').length,
  },
  byChannel: {
    phone: voters.filter(v => v.preferredContact === 'TELEFONE').length,
    whatsapp: voters.filter(v => v.preferredContact === 'WHATSAPP').length,
    email: voters.filter(v => v.preferredContact === 'EMAIL').length,
  },
  byTime: groupBy(voters, 'bestContactTime'),
  byContentType: {
    video: voters.filter(v => v.contentPreference?.includes('video')).length,
    text: voters.filter(v => v.contentPreference?.includes('texto')).length,
    images: voters.filter(v => v.contentPreference?.includes('imagens')).length,
  },
};

// Optimize contact schedule
const contactScheduleOptimization = {
  morning: voters.filter(v => v.bestContactTime === 'Manhã'),
  afternoon: voters.filter(v => v.bestContactTime === 'Tarde'),
  evening: voters.filter(v => v.bestContactTime === 'Noite'),
};

// Segment by communication needs
const communicationSegments = {
  formalPhone: voters.filter(v =>
    v.communicationStyle === 'FORMAL' && v.preferredContact === 'TELEFONE'
  ),
  informalWhatsapp: voters.filter(v =>
    v.communicationStyle === 'INFORMAL' && v.preferredContact === 'WHATSAPP'
  ),
  videoPreference: voters.filter(v =>
    v.contentPreference?.includes('video') && v.internetAccess === 'Fibra'
  ),
};
```

### 6. Demographic & Socioeconomic Analytics

**Key Metrics:**
- `ageGroup`: 18-25, 26-35, 36-50, 51-65, 65+
- `educationLevel`: Education segmentation
- `incomeLevel`: Economic segmentation
- `householdType`: Family structure
- `employmentStatus`: Employment situation
- `vehicleOwnership`: Mobility indicator
- `internetAccess`: Digital access level

**Analytics Queries:**

```typescript
// Detailed demographic profile
const demographicProfile = {
  byAge: groupBy(voters, 'ageGroup'),
  byEducation: groupBy(voters, 'educationLevel'),
  byIncome: groupBy(voters, 'incomeLevel'),
  byHouseholdType: groupBy(voters, 'householdType'),
  byEmployment: groupBy(voters, 'employmentStatus'),
  withVehicle: voters.filter(v => v.vehicleOwnership === 'SIM').length,
  byInternetAccess: groupBy(voters, 'internetAccess'),
};

// Economic vulnerability segments (for targeted messaging)
const economicSegments = {
  lowerIncome: voters.filter(v =>
    v.incomeLevel === 'ATE_1_SALARIO' || v.incomeLevel === 'DE_1_A_2_SALARIOS'
  ),
  middleClass: voters.filter(v =>
    v.incomeLevel === 'DE_2_A_5_SALARIOS' || v.incomeLevel === 'DE_5_A_10_SALARIOS'
  ),
  higherIncome: voters.filter(v => v.incomeLevel === 'ACIMA_10_SALARIOS'),
};

// Digital divide analysis (for campaign channel strategy)
const digitalAccess = {
  highSpeed: voters.filter(v => v.internetAccess === 'Fibra').length,
  mobile: voters.filter(v => v.internetAccess === '4G' || v.internetAccess === '3G').length,
  limited: voters.filter(v => v.internetAccess === 'Limitado').length,
  noAccess: voters.filter(v => v.internetAccess === 'Sem acesso').length,
};

// Mobility analysis (for event planning)
const mobilityProfile = {
  withVehicle: voters.filter(v => v.vehicleOwnership === 'SIM').length,
  withoutVehicle: voters.filter(v => v.vehicleOwnership === 'NAO').length,
  needsTransport: voters.filter(v =>
    v.vehicleOwnership === 'NAO' && v.supportLevel === 'MUITO_FAVORAVEL'
  ),
};
```

### 7. Seasonal & Temporal Analytics

**Key Metrics:**
- `seasonalActivity`: JSON patterns by month
- `registrationDate`: Cohort analysis
- `lastEngagementDate`: Activity recency
- `lastContactDate`: Contact recency

**Analytics Queries:**

```typescript
// Seasonal engagement patterns
const seasonalPatterns = voters.reduce((acc, v) => {
  if (v.seasonalActivity) {
    const patterns = JSON.parse(v.seasonalActivity);
    Object.entries(patterns).forEach(([month, activity]) => {
      acc[month] = (acc[month] || 0) + (activity as number);
    });
  }
  return acc;
}, {} as Record<string, number>);

// Cohort analysis by registration date
const cohortAnalysis = voters.reduce((acc, v) => {
  const cohort = v.registrationDate.toISOString().slice(0, 7); // YYYY-MM
  acc[cohort] = acc[cohort] || [];
  acc[cohort].push(v);
  return acc;
}, {} as Record<string, typeof voters>);

// Reactivation campaigns (by contact recency)
const reactivationSegments = {
  recentlyActive: voters.filter(v => {
    const daysSince = (Date.now() - v.lastContactDate) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  }),
  needsReengagement: voters.filter(v => {
    const daysSince = (Date.now() - v.lastContactDate) / (1000 * 60 * 60 * 24);
    return daysSince > 30 && v.supportLevel !== 'DESFAVORAVEL';
  }),
  lapsed: voters.filter(v => {
    const daysSince = (Date.now() - v.lastContactDate) / (1000 * 60 * 60 * 24);
    return daysSince > 90;
  }),
};
```

### 8. Composite Scoring & Prioritization

**Multi-dimensional Analytics:**

```typescript
// Campaign Priority Score (weighted composite)
const calculatePriorityScore = (voter) => {
  let score = 0;

  // Engagement weight (30%)
  score += (voter.engagementScore || 0) * 0.3;

  // Influence weight (25%)
  score += (voter.influencerScore || 0) * 0.25;

  // Turnout likelihood (20%)
  const turnoutScores = { ALTO: 100, MEDIO: 60, BAIXO: 20, NAO_DEFINIDO: 0 };
  score += turnoutScores[voter.turnoutLikelihood] * 0.2;

  // Persuadability (15%)
  const persuadableScores = { ALTO: 100, MEDIO: 60, BAIXO: 20 };
  score += (persuadableScores[voter.persuadability] || 0) * 0.15;

  // Network size (10%)
  score += Math.min((voter.networkSize || 0) / 5, 100) * 0.1;

  return Math.round(score);
};

// Top priority voters for campaign efforts
const prioritizedVoters = voters
  .map(v => ({ ...v, priorityScore: calculatePriorityScore(v) }))
  .sort((a, b) => b.priorityScore - a.priorityScore)
  .slice(0, 100); // Top 100

// Strategic segments matrix
const strategicMatrix = {
  vips: voters.filter(v =>
    v.influencerScore >= 80 && v.networkSize >= 200 && v.communityRole === 'LIDER'
  ),
  keyPersuasion: voters.filter(v =>
    v.persuadability === 'ALTO' && v.turnoutLikelihood === 'ALTO' && v.supportLevel === 'NEUTRO'
  ),
  loyalActivists: voters.filter(v =>
    v.supportLevel === 'MUITO_FAVORAVEL' && v.volunteerStatus === 'ATIVO' && v.engagementScore >= 70
  ),
  growthOpportunities: voters.filter(v =>
    v.engagementTrend === 'CRESCENTE' && v.responseRate >= 70 && v.supportLevel === 'FAVORAVEL'
  ),
};
```

### 9. Geographic & Spatial Analytics

**Enhanced with Influence Radius:**

```typescript
// Influence coverage map
const influenceCoverage = voters
  .filter(v => v.latitude && v.longitude && v.influenceRadius)
  .map(v => ({
    lat: parseFloat(v.latitude),
    lng: parseFloat(v.longitude),
    radius: v.influenceRadius * 1000, // km to meters
    influencer: v.communityRole === 'LIDER' || v.influencerScore >= 70,
    supportLevel: v.supportLevel,
    networkSize: v.networkSize,
  }));

// Neighborhood leadership density
const neighborhoodLeadership = voters
  .filter(v => v.communityRole === 'LIDER' || v.communityRole === 'MEMBRO_ATIVO')
  .reduce((acc, v) => {
    const key = v.neighborhood || 'Unknown';
    acc[key] = acc[key] || [];
    acc[key].push(v);
    return acc;
  }, {} as Record<string, typeof voters>);

// Coverage gaps (neighborhoods without influencers)
const allNeighborhoods = [...new Set(voters.map(v => v.neighborhood))];
const neighborhoodsWithInfluencers = Object.keys(neighborhoodLeadership);
const coverageGaps = allNeighborhoods.filter(n =>
  !neighborhoodsWithInfluencers.includes(n)
);
```

### 10. Predictive Analytics Readiness

**Data Quality Metrics:**

```typescript
// AI/ML readiness assessment
const dataQualityMetrics = {
  engagementDataComplete: voters.filter(v =>
    v.engagementScore != null && v.engagementTrend && v.responseRate != null
  ).length / voters.length * 100,

  influenceDataComplete: voters.filter(v =>
    v.influencerScore != null && v.communityRole && v.networkSize != null
  ).length / voters.length * 100,

  persuasionDataComplete: voters.filter(v =>
    v.persuadability && v.turnoutLikelihood && v.topIssues
  ).length / voters.length * 100,

  communicationDataComplete: voters.filter(v =>
    v.communicationStyle && v.contentPreference && v.bestContactTime
  ).length / voters.length * 100,

  overallCompleteness: voters.reduce((sum, v) => {
    const fields = [
      v.engagementScore, v.influencerScore, v.persuadability,
      v.turnoutLikelihood, v.communityRole, v.communicationStyle
    ];
    const filledFields = fields.filter(f => f != null).length;
    return sum + (filledFields / fields.length * 100);
  }, 0) / voters.length,
};
```

## Next Steps

1. **Run Migration**: Execute `0003_add_ai_engagement_fields.sql` on database
2. **Test Form**: Create/edit voters with new engagement fields
3. **Implement Analytics Service Methods**: Add new methods to `analytics.service.ts`:
   - `getEngagementAnalytics()`: Engagement scores, trends, response rates
   - `getInfluenceAnalytics()`: Influencer identification, network metrics
   - `getPersuasionAnalytics()`: Target identification, GOTV lists
   - `getVolunteerAnalytics()`: Volunteer management, recruitment targets
   - `getCommunicationAnalytics()`: Preference distribution, schedule optimization
   - `getDemographicExtendedAnalytics()`: Extended demographic segmentation
   - `getStrategicPrioritization()`: Composite priority scoring
   - `getDataQualityMetrics()`: AI/ML readiness assessment
4. **Build Dashboard Widgets**: Create visualization components for:
   - Engagement health dashboard
   - Influencer network map
   - Persuasion target lists
   - Volunteer recruitment pipeline
   - Communication optimization charts
5. **Implement ML Models**: Use new fields for predictive analytics:
   - Turnout prediction model
   - Persuadability scoring algorithm
   - Engagement trend forecasting
   - Network effect modeling
6. **A/B Testing**: Test communication strategies based on preferences
7. **Create Export Functions**: Generate targeted lists for:
   - Field operations (canvassing routes)
   - Digital campaigns (WhatsApp, email)
   - Event mobilization
   - Volunteer recruitment

## Notes

- All new fields are **optional** to maintain backward compatibility
- Mock data includes realistic AI-relevant values for all 200 voters
- Form validation ensures data quality (0-100 for scores, valid enums)
- Database indexes added for query performance on key AI fields
- Ready for integration with AI/ML services (OpenAI, Anthropic, etc.)
