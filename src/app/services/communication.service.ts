import {
  TFormBehaviorSubject,
  TProductBehaviorSubject,
} from '@/lib/schemas/communication';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private productBehaviorSubject = new BehaviorSubject<TProductBehaviorSubject>(
    null,
  );
  public productBehaviorSubject$ = this.productBehaviorSubject.asObservable();

  private formBehaviorSubject = new BehaviorSubject<TFormBehaviorSubject>(null);
  public formBehaviorSubject$ = this.formBehaviorSubject.asObservable();

  public updateProductEmit(value: string | undefined) {
    this.productBehaviorSubject.next({ updateId: value });
  }
}
