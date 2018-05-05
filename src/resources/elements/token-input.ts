import { bindable, customElement } from 'aurelia-framework';

@customElement('token-input')
export class TokenInputComponent {
  @bindable() value: string[];
  @bindable() label: string;
  @bindable() placeholder: string;
  @bindable() help: string;
  input: string;

  add(event: Event) {
    // event.preventDefault();
    // event.stopPropagation();
    // event.stopImmediatePropagation();

    if (!this.value) { this.value = []; }

    this.value.push(this.input);
    this.value = this.value.slice();
    this.value.sort();
    this.input = '';

    // return false;
  }
  remove(token: string) {
    this.value.splice(this.value.indexOf(token), 1);
    this.value = this.value.slice();
  }
}
