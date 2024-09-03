import { ContainerComponent } from '@/components/shared';
import { RxDBService } from '@/services/rxdb.service';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { toast } from 'ngx-sonner';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { filter, first } from 'rxjs';
import { CommunicationService } from '@/services/communication.service';
import { IUpdateProductBehaviorSubject } from '@/lib/schemas/communication';
import { ProductDocType } from '@/db/product.schema';
import { RxDocument } from 'rxdb';
import { ProductListService } from '../product-list/product-list.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './form.component.html',
  imports: [
    ContainerComponent,
    ReactiveFormsModule,
    NgTemplateOutlet,
    DatePipe,
  ],
  standalone: true,
  providers: [ProductListService],
})
export class ProductsFormComponent implements OnInit {
  constructor(
    private rxdbService: RxDBService,
    private communicationService: CommunicationService,
    private productListService: ProductListService,
  ) {
    this.communicationService.formBehaviorSubject$.subscribe((data) => {
      if (!data) return null;

      if (data.toggle) return this.showForm.set(true);

      if (data.toggle === false) this.resetAndToggleForm();

      return null;
    });

    this.communicationService.productBehaviorSubject$.subscribe((data) => {
      if (!data) return null;

      if (data.updateId) {
        return this.updateProduct(data);
      }

      return null;
    });
  }

  protected readonly datePipe = new DatePipe('en-US');

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
      createdAt: new FormControl(
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        },
      ),
    },
    {
      updateOn: 'blur',
    },
  );
  protected showForm = signal(false);
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
    this.showForm.set(params?.toggle ?? false);
  }

  async handleUpdate() {
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name ?? 'default',
      price: this.productForm.value.price ?? 1,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
    } as ProductDocType;

    const result = await this.productListService.updateProduct({
      id: this.productId()!,
      values,
    });

    if (result === 'failed' || result === 'canceled') {
      toast.error(`Product update ${result}`);
    } else {
      toast.success(`Product updated.`);
    }

    return this.resetAndToggleForm();
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

    const result = await this.productListService.createProduct({
      productForm: this.productForm,
      values,
    });

    if (result) {
      this.productForm.reset();
      toast.success('Product created successfully!', {
        dismissible: true,
        duration: 1000,
      });
    }

    if (!result) {
      toast.error('Unable to create product');
    }

    this.showForm.set(false);
  }

  convertToHTMLDate(date: string | Date | number) {
    const parsed = new Date(date);
    const piped = this.datePipe.transform(parsed, 'yyyy-MM-dd');
    return piped;
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

    this.resetAndToggleForm({
      values: {
        ...product,
        createdAt: this.convertToHTMLDate(product.createdAt),
      },
      id: product.id!,
      toggle: true,
    });
    return findOne;
  }

  toggleForm() {
    const toggle = !this.showForm();
    this.communicationService.toggleFormEmit(toggle);
  }
}
