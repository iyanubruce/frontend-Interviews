import { Component } from '@angular/core';

type User = { id: string; first: string; last: string };

@Component({
  selector: 'app-root',
  template: `
    <form class="app" (submit)="performAction($event)">
      <input
        aria-label="Search users"
        [(ngModel)]="search"
        name="search"
        placeholder="Search" />
      <div class="middle-row">
        <select
          aria-label="Users"
          class="users-list"
          name="selected"
          size="5"
          [ngModel]="selected"
          (ngModelChange)="selectUser($event)">
          <option *ngFor="let user of filteredUsers" [value]="user.id">
            {{ user.first }} {{ user.last }}
          </option>
        </select>
        <div class="inputs">
          <label>First Name: <input [(ngModel)]="first" name="first" /></label>
          <label>Last Name: <input [(ngModel)]="last" name="last" /></label>
        </div>
      </div>
      <div class="buttons">
        <button
          [disabled]="hasSelection || !hasNames"
          type="submit"
          value="create">
          Create
        </button>
        <button
          [disabled]="!hasSelection || !hasNames"
          type="submit"
          value="update">
          Update
        </button>
        <button type="submit" value="delete" [disabled]="!hasSelection">
          Delete
        </button>
        <button type="submit" value="cancel" [disabled]="!hasSelection">
          Cancel
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .app {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .middle-row,
      .buttons {
        display: flex;
        gap: 16px;
      }
      .buttons {
        gap: 4px;
      }
      .inputs {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      input {
        display: block;
      }
      .users-list {
        width: 14em;
      }
    `,
  ],
})
export class AppComponent {
  private nextId = 3;
  selected = '';
  search = '';
  first = '';
  last = '';
  users: User[] = [
    { first: 'Hans', last: 'Emil', id: '0' },
    { first: 'Max', last: 'Mustermann', id: '1' },
    { first: 'Roman', last: 'Tisch', id: '2' },
  ];

  get filteredUsers(): User[] {
    const query = this.search.toLowerCase();
    return this.users.filter((user) =>
      `${user.first} ${user.last}`.toLowerCase().includes(query),
    );
  }
  get hasSelection(): boolean {
    return this.selected !== '';
  }
  get hasNames(): boolean {
    return this.first.trim() !== '' && this.last.trim() !== '';
  }

  selectUser(id: string): void {
    this.selected = id;
    const user = this.users.find((item) => item.id === id);
    this.first = user?.first ?? '';
    this.last = user?.last ?? '';
  }
  clearSelection(): void {
    this.selected = '';
    this.first = '';
    this.last = '';
  }
  createUser(): void {
    this.users = [
      ...this.users,
      { first: this.first, last: this.last, id: String(this.nextId++) },
    ];
    this.clearSelection();
  }
  updateUser(): void {
    this.users = this.users.map((user) =>
      user.id === this.selected
        ? { ...user, first: this.first, last: this.last }
        : user,
    );
  }
  deleteUser(): void {
    this.users = this.users.filter((user) => user.id !== this.selected);
    this.clearSelection();
  }
  performAction(event: Event): void {
    event.preventDefault();
    const submitter = (event as SubmitEvent).submitter;
    const action =
      submitter instanceof HTMLButtonElement ? submitter.value : undefined;
    if (action === 'create') this.createUser();
    if (action === 'update') this.updateUser();
    if (action === 'delete') this.deleteUser();
    if (action === 'cancel') this.clearSelection();
  }
}
