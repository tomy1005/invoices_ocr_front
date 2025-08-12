import { Component } from '@angular/core';
import { SidebarRemitosComponent } from './sidebar-remitos/sidebar-remitos.component';
import { TablaRemitosComponent } from './tabla-remitos/tabla-remitos.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarRemitosComponent, TablaRemitosComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Remitos';
  items: any[] | null = null;

  constructor(private spinner: NgxSpinnerService) {}

  onItemsProcesados(items: any[]) {
    this.items = items;
  }

  onCargarRemitoStart() {
    this.spinner.show();
  }

  onCargarRemitoEnd() {
    this.spinner.hide();
  }
}
