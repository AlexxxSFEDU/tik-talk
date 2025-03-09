import {createActionGroup, props} from "@ngrx/store";
import {CommentCreateDto, Post, PostComment, PostCreateDto} from "../interfaces/post.interface";

export const postActions = createActionGroup({
  source: 'posts',
  events: {
    'create post': props<{ postContent: PostCreateDto }>(),
    'fetch posts': props<{ page?: number }>(),
    'posts loaded': props<{ posts: Post[]}>(),
    'create comment': props<{ commentContent: CommentCreateDto }>(),
  }
})
