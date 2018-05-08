import './styles/index.sass';
import { DialogSettings } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog/dist/commonjs/dialog-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { ConfigModalComponent } from 'components/config/config.modal';
import { APP_CLOSING, APP_FINISHED, APP_OPEN_CONFIG } from 'shared/events';
import { Process } from 'shared/models';

const { remote } = (window as any).nodeRequire('electron');

@autoinject()
export class App {
  constructor(
    ea: EventAggregator,
    private _dialogService: DialogService
  ) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        remote.getCurrentWindow().toggleDevTools();
      } else if (e.ctrlKey && e.key === 'r') {
        location.reload(); //doesn't work
      }
    });

    //let the app finish its things
    window.addEventListener('beforeunload', (e) => {
      ea.publish(APP_CLOSING);
      e.returnValue = true;
    });

    ea.subscribe(APP_FINISHED, () => remote.getCurrentWindow().destroy());
    ea.subscribe(APP_OPEN_CONFIG, this.appOpenConfig.bind(this));
  }

  appOpenConfig(proc?: Process) {
    const dialogConfig = <DialogSettings>{
      viewModel: ConfigModalComponent,
      model: proc
    };
    this._dialogService.open(dialogConfig);
  }

}
