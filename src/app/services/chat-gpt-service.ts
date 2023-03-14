import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import URLs from '../utils/URLs';

@Injectable()
export class ChatGPTService {
  constructor(private http: HttpClient) {}

  generateText(prompt: string, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    });
    const body = {
      prompt: prompt,
      model: 'text-davinci-003',
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    };
    return this.http.post(URLs.completion, body, { headers: headers });
  }

  generateTextFromOpemaiAPI(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      prompt: JSON.stringify({
        prompt: prompt
    }),
    };
    return this.http.post(URLs.completion, body, { headers: headers });
  }
}
