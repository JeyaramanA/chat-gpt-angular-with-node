import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatGPTService } from '../services/chat-gpt-service';
import { environment } from 'src/environments/environment';

interface Message {
  id: string;
  text: string;
  isUserMessage: boolean;
  isLoader: boolean;
  imageUrl?: string;
  loaingText?: string;
  typing?: boolean; // Set the typing property
  typingText?: string; // Set the typingText property
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  //   @ViewChild('chatContainer') chatContainer!: ElementRef;

  prompt: string = '';
  messages: Message[] = [];
  isLoading: boolean = false;
  apiKey = environment.api_key;
  id: string = '';
  progress: number = 0;

  prompts = [
    'Borrower Info',
    'Property Address',
    'Summary',
    'Doc Service',
    'Borrower DOB',
    'Borrower Phone',
    'Co-Borrower Info',
    'Co-Borrower Summary',
    'Loan Data',
  ];

  constructor(
    private http: HttpClient,
    private chatGPTService: ChatGPTService
  ) {}

  @HostListener('keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (!this.isLoading && this.prompt) {
        this.chatStripe();
        this.prompt = '';
      }
    }
  }

  ngOnInit(): void {
    this.updateProgress(50);
  }

  chatStripe() {
    const prompt = this.prompt.trim();

    if (prompt) {
      const newMessage: Message = {
        id: this.generateUniqId(),
        text: prompt,
        isUserMessage: true,
        isLoader: true,
        loaingText: 'Loading...',
      };
      console.log(newMessage.id, 'ID');
      this.id = newMessage.id;
      this.messages.push(newMessage);
      // this.prompt = '';
      this.isLoading = true;

      this.chatGPTService.generateTextFromOpemaiAPI(this.prompt).subscribe(
        (response) => {
          if (this.prompt) {
            this.prompt = '';
          }
          // const botMessage = response.choices[0].text.trim();
          const botMessage = response.bot.trim(); // trims any trailing spaces/'\n'
          const typingText = this.getTypingText(botMessage); // Get the typing text for the message
          const newMessage: Message = {
            id: this.generateUniqId(),
            text: botMessage,
            isUserMessage: false,
            isLoader: false,
            typing: true, // Set the typing property to true
            typingText: typingText, // Set the typingText property
          };
          this.id = newMessage.id;
          this.messages.push(newMessage);
          this.isLoading = false;
          // Delay printing each characters
          setTimeout(() => {
            let i = 0;
            const intervalId = setInterval(() => {
              if (i < botMessage.length) {
                newMessage.typingText = typingText.substring(0, i + 1); // Update the typing text with each character
                i++;
              } else {
                clearInterval(intervalId);
                // Pause a little before hiding the typing effect
                setTimeout(() => {
                  newMessage.typing = false; // Set the typing property to false after printing all characters
                }, 500);
              }
            }, 50);
          }, 1000);
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
  }

  loaderText(): string {
    const dots = '.'.repeat((Math.floor(Date.now() / 1000) % 3) + 1);
    return `Loading${dots}`;
  }

  generateUniqId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getTypingText(text: string): string {
    let typingText = '';
    for (let i = 0; i < text.length; i++) {
      typingText += text.charAt(i);
      typingText += i < text.length - 1 ? '\u00A0' : ''; // Add a non-breaking space after each character except the last
    }
    return typingText;
  }

  updateProgress(value: number) {
    this.progress = value;
  }

  selectPrompt(item: string) {
    this.prompt = item;
    if (this.prompt) {
      this.chatStripe();
    }
  }
}
