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
import { CommunicationService } from '@/services/communication.service';
import { IUpdateProductBehaviorSubject } from '@/lib/schemas/communication';
import { ProductDocType } from '@/db/product.schema';
import { RxDocument } from 'rxdb';

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
    private communicationService: CommunicationService,
  ) {
    this.communicationService.productBehaviorSubject$.subscribe((data) => {
      if (!data) return null;

      if (data.updateId) {
        return this.updateProduct(data);
      }

      return null;
    });
  }

  productForm = new FormGroup(
    {
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
      category: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
      price: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      description: new FormControl('', {
        nonNullable: true,
      }),
      quantity: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
        updateOn: 'blur',
      }),
      createdAt: new FormControl(new Date().toISOString(), {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
    },
    {
      updateOn: 'blur',
    },
  );
  @Input({ required: true }) showForm = false;
  @Input() formContent!: TemplateRef<unknown>;
  @Output() toggleForm = new EventEmitter<boolean>();
  private isDbReady = signal(false);
  protected productId = signal<string | null>(null);

  ngOnInit(): void {
    this.rxdbService.dataBaseReady$
      .pipe(
        filter((ready) => !!ready),
        first(),
      )
      .subscribe(() => this.isDbReady.set(true));
  }

  resetAndToggleForm(params?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: RxDocument<any>;
    id: string | null;
    toggle: boolean;
  }) {
    this.productForm.reset(params?.values ?? {});
    this.productId.set(params?.id ?? null);
    this.toggleForm.emit(params?.toggle ?? false);
  }

  async handleUpdate() {
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name ?? 'default',
      price: this.productForm.value.price ?? 1,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
    };

    const collection =
      this.rxdbService.getCollection<ProductDocType>('products');

    const query = collection.findOne({
      selector: {
        id: {
          $eq: this.productId(),
        },
      },
    });

    toast.warning('do you really want to update this product?', {
      action: {
        label: 'Update',
        onClick: async () => {
          const updated = await query.patch(values);
          if (!updated?._data) {
            toast.error('Unable to update product');
            return;
          }

          if (updated._data) {
            toast.success(`Product updated. title: ${updated._data.name}`);
            this.resetAndToggleForm();
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.success('good choice'),
      },
    });
  }

  async handleSubmit() {
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name!,
      price: this.productForm.value.price!,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
      category: this.productForm.value.category!,
      quantity: this.productForm.value.quantity!,
    };

    const result = await this.formService.createProduct({
      productForm: this.productForm,
      values,
    });

    if (result) {
      this.productForm.reset();
      toast.success('Product created successfully!');
    }

    if (!result) {
      toast.error('Unable to create product');
    }

    this.toggleForm.emit(true);
  }

  async updateProduct(data: IUpdateProductBehaviorSubject) {
    if (!data.updateId) return;
    const collection =
      this.rxdbService.getCollection<ProductDocType>('products');

    const query = collection.findOne({
      selector: {
        id: {
          $eq: data.updateId,
        },
      },
    });

    const findOne = await query.exec();
    const product = findOne?._data;
    if (!product) {
      return toast.error('Unable to find product');
    }

    this.resetAndToggleForm({ values: product, id: product.id!, toggle: true });
    return findOne;
  }
}
