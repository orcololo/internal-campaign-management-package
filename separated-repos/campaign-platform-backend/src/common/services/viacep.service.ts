import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface ViaCepResponse {
  cep: string;
  logradouro: string; // street name
  complemento: string;
  bairro: string; // neighborhood
  localidade: string; // city
  uf: string; // state
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable()
export class ViaCepService {
  private readonly logger = new Logger(ViaCepService.name);
  private readonly baseUrl = 'https://viacep.com.br/ws';

  /**
   * Get address information from Brazilian ZIP code (CEP)
   * @param cep - Brazilian ZIP code (with or without hyphen)
   * @returns Address information or null if not found
   */
  async getAddressFromCep(cep: string): Promise<ViaCepResponse | null> {
    try {
      // Remove non-numeric characters from CEP
      const cleanCep = cep.replace(/\D/g, '');

      // Validate CEP format (8 digits)
      if (cleanCep.length !== 8) {
        this.logger.warn(`Invalid CEP format: ${cep}`);
        return null;
      }

      const url = `${this.baseUrl}/${cleanCep}/json/`;
      this.logger.debug(`Fetching CEP data from: ${url}`);

      const response = await axios.get<ViaCepResponse>(url, {
        timeout: 5000,
      });

      // ViaCEP returns { erro: true } when CEP is not found
      if (response.data.erro) {
        this.logger.warn(`CEP not found: ${cleanCep}`);
        return null;
      }

      this.logger.debug(`CEP data retrieved successfully for: ${cleanCep}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching CEP ${cep}:`, error.message);
      return null;
    }
  }

  /**
   * Build full address string from ViaCEP data and house number
   * @param viaCepData - Data from ViaCEP API
   * @param addressNumber - House/building number
   * @returns Formatted address string for geocoding
   */
  buildFullAddress(viaCepData: ViaCepResponse, addressNumber?: string): string {
    const parts: string[] = [];

    // Add street name and number
    if (viaCepData.logradouro) {
      parts.push(viaCepData.logradouro);
      if (addressNumber) {
        parts.push(addressNumber);
      }
    }

    // Add neighborhood
    if (viaCepData.bairro) {
      parts.push(viaCepData.bairro);
    }

    // Add city and state
    if (viaCepData.localidade && viaCepData.uf) {
      parts.push(`${viaCepData.localidade}, ${viaCepData.uf}`);
    }

    // Add CEP
    if (viaCepData.cep) {
      parts.push(`CEP ${viaCepData.cep}`);
    }

    // Add country
    parts.push('Brasil');

    return parts.join(', ');
  }
}
