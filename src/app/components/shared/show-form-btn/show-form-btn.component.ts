import { CommunicationService } from '@/services/communication.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-show-form-btn',
  template: `
    <button
      (click)="toggleForm()"
      class="flex items-center justify-center btn btn-primary btn-md"
    >
      <svg
        viewBox="0 0 20 20"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 aspect-square"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  `,
  standalone: true,
})
export class ShowFormBtnComponent {
  constructor(private readonly communicationService: CommunicationService) { }

  toggleForm() {
    this.communicationService.toggleFormEmit(true);
  }
}
