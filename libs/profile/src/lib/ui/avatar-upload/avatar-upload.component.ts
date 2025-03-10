import { Component, signal } from '@angular/core';
import { DndDirective } from '../../../../../common-ui/src/lib/directives/dnd.directive';
import { SvgComponent } from '@tt/common-ui';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [DndDirective, SvgComponent, FormsModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/img/avatar_placeholder.png');
  avatar: File | null = null;
  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };
    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
