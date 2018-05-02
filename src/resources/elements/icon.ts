import { bindable, containerless, customElement, inlineView } from 'aurelia-framework';

@containerless()
@customElement('icon')
@inlineView('<template><svg viewBox="${fa ? \'0 0 640 512\' : \'0 0 16 16\'}" class="icon"><use xlink:href="dist/icons.svg#icon-${hash||fa}"></use></svg></template>')
export class IconComponent {
  @bindable() hash: string;
  @bindable() fa: string;
}
