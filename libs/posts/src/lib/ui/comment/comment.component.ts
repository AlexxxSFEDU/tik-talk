import { Component, input } from '@angular/core';

import { DatePipe } from '@angular/common';
import {AvatarCircleComponent, CreatedAtPipe} from "@tt/common-ui";
import {PostComment} from "../../data";


@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe, CreatedAtPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
