import { Injectable } from '@nestjs/common';
import {
  SQL,
  sql,
  eq,
  ne,
  like,
  notLike,
  inArray,
  notInArray,
  gt,
  gte,
  lt,
  lte,
  and,
  or,
  isNull,
  isNotNull,
  between,
} from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';
import { FilterDto, SortDto, FilterOperator, SortDirection } from './dto/create-report.dto';
import { voters } from '../database/schemas/voter.schema';

/**
 * QueryBuilder Service
 *
 * Converts filter and sort DTOs into Drizzle ORM queries.
 * Supports 15 filter operators for dynamic report generation.
 */
@Injectable()
export class QueryBuilderService {
  /**
   * Build WHERE clause from filters
   */
  buildWhereClause(filters: FilterDto[]): SQL | undefined {
    if (!filters || filters.length === 0) {
      return undefined;
    }

    const conditions = filters
      .map((filter) => this.buildFilterCondition(filter))
      .filter((condition) => condition !== null);

    if (conditions.length === 0) {
      return undefined;
    }

    // Combine all conditions with AND
    return and(...conditions);
  }

  /**
   * Build single filter condition based on operator
   */
  private buildFilterCondition(filter: FilterDto): SQL | null {
    const column = this.getVoterColumn(filter.field);
    if (!column) {
      return null;
    }

    switch (filter.operator) {
      case FilterOperator.EQUALS:
        return eq(column, filter.value);

      case FilterOperator.NOT_EQUALS:
        return ne(column, filter.value);

      case FilterOperator.CONTAINS:
        return sql`${column} ILIKE ${`%${filter.value}%`}`;

      case FilterOperator.NOT_CONTAINS:
        return sql`${column} NOT ILIKE ${`%${filter.value}%`}`;

      case FilterOperator.STARTS_WITH:
        return sql`${column} ILIKE ${`${filter.value}%`}`;

      case FilterOperator.ENDS_WITH:
        return sql`${column} ILIKE ${`%${filter.value}`}`;

      case FilterOperator.IN:
        if (!Array.isArray(filter.value)) {
          return null;
        }
        return inArray(column, filter.value);

      case FilterOperator.NOT_IN:
        if (!Array.isArray(filter.value)) {
          return null;
        }
        return notInArray(column, filter.value);

      case FilterOperator.GREATER_THAN:
        return gt(column, filter.value);

      case FilterOperator.GREATER_THAN_OR_EQUAL:
        return gte(column, filter.value);

      case FilterOperator.LESS_THAN:
        return lt(column, filter.value);

      case FilterOperator.LESS_THAN_OR_EQUAL:
        return lte(column, filter.value);

      case FilterOperator.BETWEEN:
        if (!Array.isArray(filter.value) || filter.value.length !== 2) {
          return null;
        }
        return between(column, filter.value[0], filter.value[1]);

      case FilterOperator.IS_NULL:
        return isNull(column);

      case FilterOperator.IS_NOT_NULL:
        return isNotNull(column);

      default:
        return null;
    }
  }

  /**
   * Build ORDER BY clause from sort rules
   */
  buildOrderByClause(sortRules: SortDto[]): SQL[] {
    if (!sortRules || sortRules.length === 0) {
      return [];
    }

    return sortRules
      .map((sortRule) => {
        const column = this.getVoterColumn(sortRule.field);
        if (!column) {
          return null;
        }

        if (sortRule.direction === SortDirection.DESC) {
          return sql`${column} DESC`;
        } else {
          return sql`${column} ASC`;
        }
      })
      .filter((orderBy) => orderBy !== null) as SQL[];
  }

  /**
   * Build SELECT clause (column selection)
   */
  buildSelectClause(columns?: string[]): Record<string, PgColumn> | undefined {
    if (!columns || columns.length === 0) {
      // Return all columns
      return undefined;
    }

    const selectObject: Record<string, PgColumn> = {};

    columns.forEach((columnName) => {
      const column = this.getVoterColumn(columnName);
      if (column) {
        selectObject[columnName] = column;
      }
    });

    return Object.keys(selectObject).length > 0 ? selectObject : undefined;
  }

  /**
   * Get voter column by field name
   */
  private getVoterColumn(fieldName: string): PgColumn | null {
    // Map field names to voter columns
    const columnMap: Record<string, PgColumn> = {
      // IDs
      id: voters.id,

      // Personal Info
      name: voters.name,
      cpf: voters.cpf,
      dateOfBirth: voters.dateOfBirth,
      email: voters.email,
      phone: voters.phone,
      whatsapp: voters.whatsapp,
      gender: voters.gender,
      occupation: voters.occupation,

      // Address
      zipCode: voters.zipCode,
      address: voters.address,
      addressNumber: voters.addressNumber,
      addressComplement: voters.addressComplement,
      neighborhood: voters.neighborhood,
      city: voters.city,
      state: voters.state,
      latitude: voters.latitude,
      longitude: voters.longitude,

      // Electoral
      electoralZone: voters.electoralZone,
      electoralSection: voters.electoralSection,
      electoralTitle: voters.electoralTitle,
      votingLocation: voters.votingLocation,

      // Social
      educationLevel: voters.educationLevel,
      incomeLevel: voters.incomeLevel,
      maritalStatus: voters.maritalStatus,
      religion: voters.religion,
      ethnicity: voters.ethnicity,

      // Campaign
      supportLevel: voters.supportLevel,
      politicalParty: voters.politicalParty,
      influencerScore: voters.influencerScore,
      persuadability: voters.persuadability,
      turnoutLikelihood: voters.turnoutLikelihood,

      // Social Media
      facebook: voters.facebook,
      instagram: voters.instagram,
      twitter: voters.twitter,

      // Engagement
      lastContactDate: voters.lastContactDate,
      engagementScore: voters.engagementScore,
      engagementTrend: voters.engagementTrend,
      communicationStyle: voters.communicationStyle,

      // Community
      communityRole: voters.communityRole,
      volunteerStatus: voters.volunteerStatus,

      // Referral
      referralCode: voters.referralCode,
      referredBy: voters.referredBy,
      referralDate: voters.referralDate,

      // Metadata
      tags: voters.tags,
      notes: voters.notes,
      deletedAt: voters.deletedAt,
      createdAt: voters.createdAt,
      updatedAt: voters.updatedAt,
    };

    return columnMap[fieldName] || null;
  }

  /**
   * Validate filter field exists
   */
  isValidField(fieldName: string): boolean {
    return this.getVoterColumn(fieldName) !== null;
  }

  /**
   * Get list of all available fields
   */
  getAvailableFields(): string[] {
    return [
      'id',
      'name',
      'cpf',
      'dateOfBirth',
      'email',
      'phone',
      'whatsapp',
      'gender',
      'occupation',
      'zipCode',
      'address',
      'addressNumber',
      'addressComplement',
      'neighborhood',
      'city',
      'state',
      'latitude',
      'longitude',
      'electoralZone',
      'electoralSection',
      'electoralTitle',
      'votingLocation',
      'educationLevel',
      'incomeLevel',
      'maritalStatus',
      'religion',
      'ethnicity',
      'supportLevel',
      'politicalParty',
      'influencerScore',
      'persuadability',
      'turnoutLikelihood',
      'facebook',
      'instagram',
      'twitter',
      'lastContactDate',
      'engagementScore',
      'engagementTrend',
      'communicationStyle',
      'communityRole',
      'volunteerStatus',
      'referralCode',
      'referredBy',
      'referralDate',
      'tags',
      'notes',
      'createdAt',
      'updatedAt',
    ];
  }
}
