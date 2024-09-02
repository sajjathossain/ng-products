import { ContainerComponent } from '@/components/shared';
import { RxDBService } from '@/services/rxdb.service';
import { NgTemplateOutlet } from '@angular/common';
import { toast } from 'ngx-sonner';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { filter, first } from 'rxjs';
import { FormService } from './form.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './form.component.html',
  imports: [ContainerComponent, ReactiveFormsModule, NgTemplateOutlet],
  standalone: true,
  providers: [FormService],
})
export class ProductsFormComponent implements OnInit {
  constructor(
    private rxdbService: RxDBService,
    private formService: FormService,
  ) {}

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
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.min(5)],
      }),
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
  @Input() formContent!: TemplateRef<unknown>;
  @Output() toggleForm = new EventEmitter<boolean>();
  private isDbReady = signal(false);

  ngOnInit(): void {
    this.rxdbService.dataBaseReady$
      .pipe(
        filter((ready) => !!ready),
        first(),
      )
      .subscribe(() => this.isDbReady.set(true));
  }

  async handleSubmit() {
    const id = new Date().getTime().toString();
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name ?? 'default',
      price: this.productForm.value.price ?? 1,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
      id,
    };

    const result = await this.formService.createProduct({
      productForm: this.productForm,
      values,
    });

    if (result) {
      toast.success('Product created successfully!');
    }

    if (!result) {
      toast.error('Unable to create product');
    }

    this.toggleForm.emit(true);
  }
}
