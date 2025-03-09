import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import {ChatService} from "@tt/data-access";


@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [ChatsListComponent, RouterOutlet],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit {
  #chatService = inject(ChatService);

  ngOnInit() {
    this.#chatService.connectWs().subscribe()
  }
}
