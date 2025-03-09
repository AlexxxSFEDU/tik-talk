import {Component, inject, Input} from '@angular/core';
import { ImgUrlPipe } from '@tt/common-ui';
import {firstValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {ChatService, Profile} from "@tt/data-access";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  chatService = inject(ChatService);
  router = inject(Router);
  @Input() profile!: Profile;

  async sendMessage(id: number) {
    firstValueFrom(this.chatService.createChat(id)).then((res)=>{
      this.router.navigate(['/chats', res.id])
    })
  }
}
