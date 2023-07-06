import axios, { AxiosResponse } from 'axios';
import { URL } from '../repositories/formance-repository.root';

export interface Authentication {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export class FormanceAuthentificationService {
  private readonly clientId = 'f382034a-2994-4832-a583-e4baac6e0962';
  private readonly secretId = 'ff13eed4-1e2f-46ec-95db-ba0b832d9ed7';

  constructor(private readonly url: URL) {}

  async getAuth(): Promise<Authentication> {
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', this.clientId);
    formData.append('client_secret', this.secretId);
    const { status, data }: AxiosResponse<Authentication> =
      await axios<Authentication>({
        method: 'post',
        url: `${this.url}/api/auth/oauth/token`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    console.log('data', data);
    if (status === 200) {
      return data;
    }
    throw new Error('Error in auth');
  }
}
