import { ContainerComponent } from '@/components/shared';
import { ProductDocType } from '@/db/product.schema';
import { RxDBService } from '@/services/rxdb.service';
import { NgTemplateOutlet } from '@angular/common';
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

@Component({
  selector: 'app-products-form',
  templateUrl: './form.component.html',
  imports: [ContainerComponent, ReactiveFormsModule, NgTemplateOutlet],
  standalone: true,
})
export class ProductsFormComponent implements OnInit {
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
  private collectionName = 'products';

  constructor(private rxdbService: RxDBService) { }

  ngOnInit(): void {
    this.rxdbService.dataBaseReady$
      .pipe(
        filter((ready) => !!ready),
        first(),
      )
      .subscribe(() => this.isDbReady.set(true));
  }

  async handleSubmit() {
    console.log('data', this.productForm.value);
    const id = new Date().getTime().toString();
    const productXCollection = this.rxdbService.getCollection<ProductDocType>(
      this.collectionName,
    );
    const result = await productXCollection.insert({
      ...this.productForm.value,
      name: this.productForm.value.name ?? 'default',
      price: this.productForm.value.price ?? 1,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
      id,
    });
    console.log('result', result);
    this.toggleForm.emit(true);
  }
}
