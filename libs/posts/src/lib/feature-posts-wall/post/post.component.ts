import { Component, inject, input, OnInit, signal } from '@angular/core';

import { DatePipe } from '@angular/common';

import {PostInputComponent, CommentComponent} from "../../ui";
import { firstValueFrom } from 'rxjs';
import {Post, PostComment, PostService} from "../../data";
import {AvatarCircleComponent, CreatedAtPipe, SvgComponent} from "@tt/common-ui";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgComponent,
    PostInputComponent,
    CommentComponent,
    CreatedAtPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  comments = signal<PostComment[]>([]);
  postService = inject(PostService);

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated() {
    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );
    //@ts-ignore
    this.comments.set(comments);
  }
}
