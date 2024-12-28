import { Component, input } from '@angular/core';
import {Profile} from "@tt/profile";
import {AvatarCircleComponent, ImgUrlPipe} from "@tt/common-ui";


@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [ImgUrlPipe, AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  profile = input<Profile>();
}
