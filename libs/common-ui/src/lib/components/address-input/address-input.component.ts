import {ChangeDetectionStrategy, Component, forwardRef, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TtInputComponent} from '../tt-input/tt-input.component';
import {DadataService} from "../../data";
import {debounceTime, switchMap, tap} from "rxjs";


@Component({
  selector: 'tt-address-input',
  standalone: true,
  imports: [CommonModule, TtInputComponent, ReactiveFormsModule],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl();
  #dadataService = inject(DadataService);

  isDropdownOpened = signal<boolean>(true)

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
  })

  suggestions$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap(value => {
      return this.#dadataService.getSuggestion(value)
        .pipe(
          tap(res => {
            this.isDropdownOpened.set(res.length > 0);
          })
        )
    })
  )

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(city: string | null): void {
    this.innerSearchControl.patchValue(city, {
      emitEvent: false
    })
  }

  onChange(value: any): void {
  }

  onTouched(value: any): void {
  }

  onSuggestionPick(city: string | null) {
    this.isDropdownOpened.set(false)
    this.innerSearchControl.patchValue(city, {
      emitEvent: false
    })
    console.log(this.innerSearchControl.value)
    this.onChange(city)
    //   this.addressForm.patchValue({
    //     city: suggest.data.city,
    //     street: suggest.data.street,
    //     building: suggest.data.house
    //   })
    // }
  }
}
