import {ChangeDetectionStrategy, Component, forwardRef, input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'tt-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TtInputComponent implements ControlValueAccessor {
  type = input<'text' | 'password'>('text')
  placeholder = input<string>()

  disabled = signal<boolean>(false)

  onChange: any
  onTouched: any

  value: string | null = null

  writeValue(value: string | null) {
    console.log(value)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled)
    console.log(isDisabled)
  }

  onModelChange(val: string | null) {
    this.onChange(val)
  }
}
