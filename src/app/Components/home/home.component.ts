import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { GhostUserService } from '../../Services/ghost-user.service';
import { SignalHelperService } from '../../Services/signal-helper.service';
import { SocketService } from '../../Services/socket.service';
import { FormsModule } from '@angular/forms';
interface GameCategory {
  id: string;
  name: string;
  icon: string;
}

interface Game {
  id: string;
  title: string;
  img: string;
  description: string;
  activeRooms: number;
  currentPlayers: number;
  maxPlayers: number;
  category: string;
  isNew: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChatComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Theme state
  isDarkMode = false;

  // Navigation state
  isSidenavOpen = false;
  currentSection = 'home';
  showCategories = true;
  tempUserName: string = ''; // Players state
  showPlayersList = false;
  onlineUsers: number = 0;
  livePlayers = [];

  userName: string = '';
  // Categories
  currentCategory = 'all';
  gameCategories: GameCategory[] = [
    { id: 'all', name: 'All Games', icon: 'grid_view' },
    { id: 'action', name: 'Action', icon: 'bolt' },
    { id: 'puzzle', name: 'Puzzle', icon: 'extension' },
    { id: 'strategy', name: 'Strategy', icon: 'psychology' },
    { id: 'casual', name: 'Casual', icon: 'stars' },
  ];

  // Games data
  games: Game[] = [
    {
      id: '1',
      title: 'Tomato Rush',
      img: 'assets/game1.jpg',
      description: 'Fast-paced action with power-ups!',
      activeRooms: 3,
      currentPlayers: 12,
      maxPlayers: 20,
      category: 'action',
      isNew: true,
    },
    {
      id: '2',
      title: 'Puzzle Garden',
      img: 'assets/game2.jpg',
      description: 'Solve puzzles in a peaceful garden.',
      activeRooms: 2,
      currentPlayers: 8,
      maxPlayers: 15,
      category: 'puzzle',
      isNew: false,
    },
    {
      id: '3',
      title: 'Tomato Empire',
      img: 'assets/game3.jpg',
      description: 'Build your farming empire!',
      activeRooms: 5,
      currentPlayers: 25,
      maxPlayers: 30,
      category: 'strategy',
      isNew: true,
    },
  ];

  constructor(
    private ghostUser: GhostUserService,
    private signal: SignalHelperService,
    private socketService: SocketService
  ) {
    this.socketService.onMessage('connect').subscribe(() => {
      this.ghostUser.userName$.subscribe((userName) => {
        this.socketService.sendMessage('user name', userName);
        this.userName = userName;
      });
    });
    effect(() => {
      this.isDarkMode = this.signal.darkMode();
      console.log(this.isDarkMode);
    });
  }

  ngOnInit() {
    // Check user's theme preference
    this.socketService.onMessage('users').subscribe((users: any) => {
      this.livePlayers = users.map((user: any) => user['userName']);
      this.onlineUsers = users.length;
    });
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Computed properties
  get filteredGames(): Game[] {
    return this.currentCategory === 'all'
      ? this.games
      : this.games.filter((game) => game.category === this.currentCategory);
  }

  get arrowIcon(): string {
    return this.isSidenavOpen ? 'chevron_left' : 'chevron_right';
  }

  // Methods
  toggleTheme() {
    this.signal.setDarkMode(!this.isDarkMode);
  }

  setUserName() {
    if (this.tempUserName.trim().length > 0) {
      this.ghostUser.userName.next(this.tempUserName);
      this.tempUserName = '';
    }
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  navigateTo(section: string) {
    this.currentSection = section;
    // Add navigation logic here
  }

  filterByCategory(categoryId: string) {
    this.currentCategory = categoryId;
  }

  playGame(gameId: string) {
    console.log(`Starting game ${gameId}`);
    // Add game start logic here
  }
}
