import { ContainerComponent } from '@/components/shared';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-products-form',
  templateUrl: './form.component.html',
  imports: [ContainerComponent, ReactiveFormsModule],
  standalone: true,
})
export class ProductsFormComponent {
  productForm = new FormGroup(
    {
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur',
        nonNullable: true,
      }),
      category: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
        nonNullable: true,
      }),
      price: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
        updateOn: 'blur',
      }),
      description: new FormControl(''),
      quantity: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
        updateOn: 'blur',
      }),
      createdAt: new FormControl(new Date().toISOString(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      updateOn: 'change',
    },
  );
  @Input({ required: true }) showForm = false;

  handleSubmit() {
    console.log('submit', this.productForm.value);
  }
}
