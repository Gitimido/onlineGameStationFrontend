import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../Services/socket.service';
import { GhostUserService } from '../../Services/ghost-user.service';
import { SignalHelperService } from '../../Services/signal-helper.service';

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  isExpanded = false;
  isDarkMode = false;
  isConnected = false;
  onlineUsers = 0;
  currentUser = 'You';
  newMessage = '';
  messages: ChatMessage[] = [
    {
      sender: 'System',
      message: 'Welcome to the chat!',
      timestamp: new Date(),
    },
  ];

  // Add scroll management properties
  private shouldAutoScroll = true;

  constructor(
    private socketService: SocketService,
    private ghostUser: GhostUserService,
    private signal: SignalHelperService
  ) {
    effect(() => {
      this.isDarkMode = this.signal.darkMode();
      console.log(this.isDarkMode);
    });
  }

  ngOnInit() {
    this.ghostUser.userName$.subscribe((userName) => {
      this.currentUser = userName;
    });

    this.socketService.onMessage('connect').subscribe(() => {
      this.isConnected = true;
    });

    this.socketService.onMessage('chat message').subscribe((msg: any) => {
      // Check scroll position before adding new message

      console.log(msg);
      this.shouldAutoScroll = this.isNearBottom();

      this.messages.push({
        sender: msg.sender,
        message: msg.message,
        timestamp: new Date(msg.timestamp),
      });
      console.log(this.messages);
    });

    this.socketService.onMessage('users').subscribe((users: any) => {
      this.onlineUsers = users.length;
    });
  }

  // Scroll management methods
  ngAfterViewChecked() {
    this.scrollToBottomIfNeeded();
  }

  private isNearBottom(): boolean {
    if (!this.messageContainer) {
      return false;
    }
    const element = this.messageContainer.nativeElement;
    const threshold = 5; // pixels from bottom to consider "near bottom"
    const position =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    return position < threshold;
  }

  private scrollToBottomIfNeeded(): void {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement;
      if (this.shouldAutoScroll) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }

  onScroll(): void {
    this.shouldAutoScroll = this.isNearBottom();
  }

  toggleChat() {
    this.isExpanded = !this.isExpanded;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.isConnected) {
      // Check scroll position before adding new message
      this.shouldAutoScroll = this.isNearBottom();

      const message = {
        sender: this.currentUser,
        message: this.newMessage,
        timestamp: new Date(),
      };

      this.messages.push(message);
      this.socketService.sendMessage('chat message', message);
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    this.socketService.sendMessage('disconnect', null);
  }
}
