export interface IUpdateProductBehaviorSubject {
  updateId: string | undefined;
  deleteId?: null;
}

export interface IDeleteProductBehaviorSubject {
  deleteId: string | undefined;
  updateId?: null;
}

export interface IToggleFormBehaviorSubject {
  toggle: boolean;
}

export type TProductBehaviorSubject =
  | IUpdateProductBehaviorSubject
  | IDeleteProductBehaviorSubject
  | null;
export type TFormBehaviorSubject = IToggleFormBehaviorSubject | null;
