import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {postActions} from "./actions";
import {map, switchMap} from "rxjs";
import {PostService} from "../services/post.service";

@Injectable({
  providedIn: 'root'
})

export class PostEffects {
  postService = inject(PostService)
  actions$ = inject (Actions)

  createPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createPost),
      switchMap(({postContent}) => {
        return this.postService.createPost(postContent)
      }),
      map(res => postActions.fetchPosts({}))
    )
  })

  fetchPosts$ = createEffect( ()=> {
    return this.actions$.pipe(
      ofType(postActions.fetchPosts),
      switchMap(()=>{
        return this.postService.fetchPosts()
      }),
      map(res => postActions.postsLoaded({posts: res}))
    )
  })

  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createComment),
      switchMap(({commentContent}) => {
        return this.postService.createComment(commentContent)
      }),
      map(res => postActions.fetchPosts({}))
    )
  })
}
