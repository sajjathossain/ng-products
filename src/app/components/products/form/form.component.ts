import { ContainerComponent } from '@/components/shared';
import { RxDBService } from '@/db/rxdb.service';
import { DatePipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { toast } from 'ngx-sonner';
import { Component, OnInit, effect, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
} from 'rxjs';
import { CommunicationService } from '@/services/communication.service';
import { IUpdateProductBehaviorSubject } from '@/lib/types';
import { ProductDocType } from '@/db/product/schema';
import { RxDocument } from 'rxdb';
import { ProductRepositoryService } from '@/db/product/repository.service';
import { CategoryDocType } from '@/db/category/schema';

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
  providers: [ProductRepositoryService, KeyValuePipe],
})
export class ProductsFormComponent implements OnInit {
  constructor(
    private rxdbService: RxDBService,
    private communicationService: CommunicationService,
    private productRepositoryService: ProductRepositoryService,
  ) {
    effect(() => {
      if (this.isDbReady()) {
        const products =
          this.rxdbService.getCollection<ProductDocType>('products');
        products
          .find({ sort: [{ createdAt: 'desc' }] })
          .$.subscribe((result) => {
            const obj = this.convertRxDocumentToCategoryObject(result);

            this.categories.set(obj);
          });
      }
    });

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

    this.rxdbService.dataBaseReady$
      .pipe(
        filter((ready) => !!ready),
        first(),
      )
      .subscribe(() => {
        this.isDbReady.set(true);
      });
  }

  showCategorySelect = signal(false);
  keys = Object.keys;
  categories = signal<Record<string, number>>({});
  _categories = signal<string[]>([]);

  protected readonly datePipe = new DatePipe('en-US');
  protected image$ = new BehaviorSubject<string>('');

  productForm = new FormGroup(
    {
      id: new FormControl('', {
        nonNullable: true,
      }),
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
        validators: [Validators.maxLength(250)],
      }),
      image: new FormControl('', {
        nonNullable: true,
        validators: [Validators.min(1)],
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
      updateOn: 'change',
    },
  );
  protected showForm = signal(false);
  private isDbReady = signal(false);
  protected productId$ = new BehaviorSubject<string | null>(null);
  protected input$ = new BehaviorSubject<string>('');
  protected maxQuantity$ = new BehaviorSubject<number>(10);
  protected initialCategory = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.input$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.adjustFormValidation({ category: term });
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async adjustFormValidation(values: Partial<any>) {
    const { category } = values;

    const collection =
      this.rxdbService?.getCollection<CategoryDocType>('categories');

    const query = collection?.find({
      selector: {
        name: {
          $regex: `^.*${category}.*$`,
          $options: 'i',
        },
      },
    });
    const docs = await query?.exec();

    const shouldShow = docs?.length > 0 && this.input$.getValue().length > 0;
    this.showCategorySelect?.set(shouldShow);

    const mapped = docs?.map((item) => item?._data.name);
    this._categories?.set(mapped);

    const findOneQuery = collection?.findOne({
      selector: {
        name: {
          $eq: category,
        },
      },
    });

    const find = await findOneQuery?.exec();
    const products = (await find?.populate('products')) as {
      _data: ProductDocType;
    }[];
    const productId = this.productId$.getValue();
    const product = products?.find((item) => item?._data.id === productId);
    // const formQuantity = Number(this.productForm?.get('quantity')?.value);
    const currentCategoryProductQuantity = find?._data
      .currentQuantity as number;
    console.log({ currentCategoryProductQuantity });
    // max quantity for normal scenario when creating a new product
    const productQuantity = productId || product ? product?._data.quantity : 0;
    const max = 10 - (currentCategoryProductQuantity - (productQuantity ?? 0));
    console.log({ max });

    const isNaN = Number.isNaN(max);
    this.maxQuantity$?.next(isNaN ? 10 : max);
  }

  resetAndToggleForm(params?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: RxDocument<any>;
    id: string | null;
    toggle: boolean;
  }) {
    this.productForm.reset(params?.values ?? {});
    this.productId$.next(params?.id ?? null);
    this.maxQuantity$.next(10);
    this.image$.next(params?.values.image ?? '');
    this.showForm.set(params?.toggle ?? false);
  }

  async handleUpdate(event: Event) {
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name ?? 'default',
      price: this.productForm.value.price ?? 1,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
      image: this.image$.getValue().length
        ? this.image$.getValue()
        : this.productForm.get('image')?.value,
    } as ProductDocType;

    const result = await this.productRepositoryService.updateProduct({
      id: this.productId$.getValue()!,
      values,
      initialCategory: this.initialCategory.getValue(),
    });

    if (result === 'failed' || result === 'canceled') {
      toast.error(`Product update ${result}`);
    } else {
      toast.success(`Product updated.`);
    }

    this.initialCategory.next('');
    (event.target as HTMLFormElement)?.reset();

    return this.resetAndToggleForm();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result;
        this.image$.next(url! as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async handleSubmit(event: Event) {
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name!,
      price: this.productForm.value.price!,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
      category: this.productForm.value.category!,
      quantity: this.productForm.value.quantity!,
      image: this.image$.getValue(),
    };

    const result = await this.productRepositoryService.createProduct({
      productForm: this.productForm,
      values,
    });

    if (result) {
      this.resetAndToggleForm();
      toast.success('Product created successfully!', {
        dismissible: true,
        duration: 1000,
      });
    }

    if (!result) {
      toast.error('Unable to create product');
    }

    (event.target as HTMLFormElement)?.reset();
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

    const initialValues = {
      ...product,
      createdAt: this.convertToHTMLDate(product.createdAt),
    };
    this.productId$.next(product.id!);
    this.initialCategory?.next(initialValues.category);

    this.productForm.valueChanges.subscribe((data) =>
      this.adjustFormValidation(data),
    );
    // this.filterByCategory(product.category);

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

  isFieldInvalid(field: string) {
    const control = this.productForm.get(field);
    const isInvalid = control?.invalid && (control?.touched || control?.dirty);

    return isInvalid;
  }

  getValue(field: string) {
    const control = this.productForm.get(field);
    const value = control?.value;

    return value;
  }

  remaingCharactersCount(field: string, maxLength: number) {
    const control = this.productForm.get(field);
    const value = control?.value;
    const sub = maxLength - value?.length;
    return sub;
  }

  convertRxDocumentToCategoryObject(data: RxDocument<ProductDocType>[]) {
    const map = new Map<string, number>();
    data.forEach((item) => {
      const quantity = map.get(item.category) ?? 0;
      map.set(item.category, quantity + item.quantity);
    });

    const obj = Object.fromEntries(map);
    return obj;
  }

  selectCategory(category: string) {
    console.log({ category });
    this.productForm.get('category')?.setValue(category);
    this.showCategorySelect.set(false);
    this.input$.next(category);
  }

  handleInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.input$.next(term);
  }

  toggleForm() {
    const toggle = !this.showForm();
    this.communicationService.toggleFormEmit(toggle);
  }
}
