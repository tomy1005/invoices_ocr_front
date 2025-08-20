import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MistralApiService } from '../../../services/mistral/mistral-api.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar-remitos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './sidebar-remitos.component.html',
  styleUrls: ['./sidebar-remitos.component.scss']
})
export class SidebarRemitosComponent implements OnInit, OnDestroy {
  remitoForm: FormGroup;
  empresas = [
    { id: 1, nombre: 'Empresa A' },
    { id: 2, nombre: 'Empresa B' },
    { id: 3, nombre: 'Empresa C' }
  ];

  @Output() itemsProcesados = new EventEmitter<any[]>();
  @Output() procesarRemitoStart = new EventEmitter<void>();
  @Output() procesarRemitoEnd = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private mistralApi: MistralApiService, private toastr: ToastrService, private authService: AuthService) {
    this.remitoForm = this.fb.group({
      empresa: [null, Validators.required],
      fecha: [null, Validators.required],
      archivos: [null, Validators.required]
    });
  }

  ngOnInit(): void { }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.remitoForm.patchValue({ archivos: input.files });
    } else {
      this.remitoForm.patchValue({ archivos: null });
    }
  }
  onSubmit() {
    if (this.remitoForm.valid) {
      const { fecha, empresa } = this.remitoForm.value;
      const archivos = this.remitoForm.get('archivos')?.value as FileList;
      if (!archivos || archivos.length === 0) {
        this.toastr.error('Debes subir al menos un archivo.');
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < archivos.length; i++) {
        formData.append('invoices', archivos[i]);
        formData.append('date', fecha);
        formData.append('company', empresa);
      }

      this.procesarRemitoStart.emit();

      this.mistralApi.procesarMultiplesRemitos(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            const resultados = res?.results || [];
            resultados.forEach((r: any) => {
              this.toastr.success(`Archivo procesado: ${r.filename}`, 'Éxito');
            });

            // Emitir todos los items encontrados
            const todosLosItems = resultados.flatMap((r: any) =>
              (r.data.items || []).map((item: any) => ({
                ...item,
                date: fecha,
                company: empresa
              }))
            );
            this.itemsProcesados.emit(todosLosItems);

            this.procesarRemitoEnd.emit();
          },
          error: (err) => {
            this.toastr.error('Hubo un error al enviar los archivos.', 'Error');
            console.error(err);
            this.procesarRemitoEnd.emit();
          }
        });
    }
  }

  logout() {
    this.authService.signout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
