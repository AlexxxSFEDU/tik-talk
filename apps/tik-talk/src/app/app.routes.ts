
import { FormsExperimentComponent } from './experimental/forms-experiment/forms-experiment.component';
import { SettingsPageComponent} from "@tt/profile";
import {LoginPageComponent} from "@tt/auth";
import {Routes} from "@angular/router";
import {ProfilePageComponent, SearchPageComponent} from "@tt/profile";
import {chatsRoutes} from "@tt/chats";
import {LayoutComponent} from "@tt/layout";
import {profileFeature} from "@tt/profile";
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {ProfileEffects} from "@tt/profile";
import {canActivateAuth} from "@tt/data-access";
import {PostEffects, postFeature} from "../../../../libs/posts/src/lib/data/store";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile/me',
        pathMatch: 'full',
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postFeature),
          provideEffects(PostEffects)
        ]
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
      {
        path: 'experimental',
        component: FormsExperimentComponent,
      },
    ],
    canActivate: [canActivateAuth],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
];
