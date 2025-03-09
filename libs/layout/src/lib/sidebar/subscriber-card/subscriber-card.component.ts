import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Profile} from '@tt/profile';
import {ImgUrlPipe} from '@tt/common-ui';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [ImgUrlPipe, RouterLink],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriberCardComponent {
  @Input() profile!: Profile;
}
