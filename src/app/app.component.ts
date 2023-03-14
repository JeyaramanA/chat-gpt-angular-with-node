import { Component, HostListener } from '@angular/core';
import { environment } from '../environments/environment';
import { ChatGPTService } from './services/chat-gpt-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  prompt = '';
  model = 'text-davinci-003';
  apiKey = environment.api_key;
  generatedText = '';

  constructor(private chatGPTService: ChatGPTService) {}

  // @HostListener('keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     this.onGenerateText();
  //     this.prompt = '';
  //   }
  // }

  // onGenerateText() {
  //   this.chatGPTService
  //     .generateText(this.prompt, this.model, this.apiKey)
  //     .subscribe((response) => {
  //       this.generatedText = response.choices[0].text;
  //     });
  // }
}
