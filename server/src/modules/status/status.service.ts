import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class StatusService {
  async updateComponentStatus(
    componentId: string,
    status: string,
    pageId: string,
    apiKey: string
  ): Promise<any> {
    const apiUrl = `https://api.statuspage.io/v1/pages/${pageId}/components/${componentId}`;
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `OAuth ${apiKey}`,
      },
      body: JSON.stringify({
        component: {
          status: status,
          name: 'APi',
        },
      }),
    });

    const data = await response.json();
    return data;
  }
}
