import axios, { AxiosResponse } from 'axios';
import { URL } from '../repositories/formance-repository.root';
import { ConfigService } from '@nestjs/config';

export interface Authentication {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}
export interface OAuthCredentials {
  clientId: string;
  secretId: string;
}
export class FormanceAuthentificationService {
  constructor(
    private readonly credentials: OAuthCredentials,
    private readonly url: URL,
  ) {}

  async getAuth(): Promise<Authentication> {
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', this.credentials.clientId);
    formData.append('client_secret', this.credentials.secretId);
    const { status, data }: AxiosResponse<Authentication> =
      await axios<Authentication>({
        method: 'post',
        url: `${this.url}/api/auth/oauth/token`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    if (status === 200) {
      return data;
    }
    throw new Error('Error in auth');
  }
}
