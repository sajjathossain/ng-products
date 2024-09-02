export interface IUpdateProductBehaviorSubject {
  updateId: string | undefined;
}

export interface IToggleFormBehaviorSubject {
  toggle: boolean;
}

export type TProductBehaviorSubject = IUpdateProductBehaviorSubject | null;
export type TFormBehaviorSubject = IToggleFormBehaviorSubject | null;
