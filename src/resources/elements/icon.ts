import { bindable, containerless, customElement, inlineView } from 'aurelia-framework';

@containerless()
@customElement('icon')
@inlineView('<template><svg viewBox="0 0 16 16" class="icon"><use xlink:href="dist/icons.svg#icon-${hash}"></use></svg></template>')
export class IconComponent {
  @bindable() hash: string;
}
