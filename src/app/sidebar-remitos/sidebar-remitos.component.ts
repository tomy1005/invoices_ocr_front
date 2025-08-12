import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MistralApiService } from '../mistral-api.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService, ToastrModule } from 'ngx-toastr';

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

  constructor(private fb: FormBuilder, private mistralApi: MistralApiService, private toastr: ToastrService) {
    this.remitoForm = this.fb.group({
      empresa: [null, Validators.required],
      fecha: [null, Validators.required],
      cuit: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      archivos: [null, Validators.required]  // plural y obligatorio
    });
  }

  ngOnInit(): void { }

  /*onSubmit() {
    if (this.remitoForm.valid) {
      const remitoData = { ...this.remitoForm.value };
      if (remitoData.archivo && remitoData.archivo instanceof FileList) {
        const archivo = remitoData.archivo[0];
        this.procesarRemitoStart.emit();
        this.mistralApi.procesarRemito(archivo)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (respuesta) => {
              this.itemsProcesados.emit(respuesta.items || []);
              this.procesarRemitoEnd.emit();
              this.toastr.success('Escaneo exitoso', '¡Éxito!', { positionClass: 'toast-bottom-right', timeOut: 3000, progressBar: true, closeButton: true });
              console.log('Remito procesado:', respuesta);
            },
            error: (err) => {
              this.procesarRemitoEnd.emit();
              this.toastr.error('Hubo un error, vuelva a intentarlo', 'Error', { positionClass: 'toast-bottom-right', timeOut: 4000, progressBar: true, closeButton: true });
              console.error('Error al procesar el remito:', err);
            }
          });
      } else {
        console.log('Remito enviado (sin archivo):', remitoData);
      }
    }
  }*/

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
      const archivos = this.remitoForm.get('archivos')?.value as FileList;
      if (!archivos || archivos.length === 0) {
        this.toastr.error('Debes subir al menos un archivo.');
        return;
      }
  
      const formData = new FormData();
      for (let i = 0; i < archivos.length; i++) {
        formData.append('invoices', archivos[i]); // <- clave exacta requerida por el backend
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
            const todosLosItems = resultados.flatMap((r: any) => r.data.items || []);
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
