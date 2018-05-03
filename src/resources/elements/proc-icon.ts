import { bindable, containerless, customElement, inlineView } from 'aurelia-framework';

@containerless()
@customElement('proc-icon')
@inlineView('<template><svg viewBox="0 0 16 16" class="icon pm-${state}"><use xlink:href="dist/icons.svg#icon-${state === \'idle\' || state === \'running\' ? \'switch\': \'spinner\'}"></use></svg></template>')
export class IconComponent {
  @bindable() state: string;
}


