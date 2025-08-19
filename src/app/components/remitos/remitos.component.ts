import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TablaRemitosComponent } from './tabla-remitos/tabla-remitos.component';
import { SidebarRemitosComponent } from './sidebar-remitos/sidebar-remitos.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-remitos',
  standalone: true,
  imports: [CommonModule,SidebarRemitosComponent, TablaRemitosComponent, NgxSpinnerModule],
  templateUrl: './remitos.component.html',
  styleUrls:['./remitos.component.scss']
})
export class RemitosComponent {
  items: any[] | null = null;

  constructor(private spinner: NgxSpinnerService) {
  }

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
