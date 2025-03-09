import {ChangeDetectionStrategy, Component, effect, inject, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators,} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {ProfileService} from '../../../../../data-access/src/lib/data/services/profile.service';
import {AvatarUploadComponent, ProfileHeaderComponent} from "../../ui";
import {AddressInputComponent, StackInputComponent, SvgComponent} from "@tt/common-ui";
import {AuthService} from "@tt/data-access";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent, StackInputComponent, AddressInputComponent, SvgComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  authService = inject(AuthService)

  @ViewChild(AvatarUploadComponent) avatarUploader: any;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: [''],
    city: ['']
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }
    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value
      })
    );
  }

  logout() {
    this.authService.logout()
  }
}
