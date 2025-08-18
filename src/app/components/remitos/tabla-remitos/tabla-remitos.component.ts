import { Component, Input, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tabla-remitos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tabla-remitos.component.html',
  styleUrls: ['./tabla-remitos.component.scss']
})
export class TablaRemitosComponent implements OnDestroy {
  tablaForm: FormGroup;
  group!: FormGroup;
  // Estado para mostrar el modal de confirmación
  showConfirmModal = false;
  // Remito seleccionado (para cargar)
  remitoSeleccionado: any = null;
  showClearModal = false;
  pendingItemsToAdd: any[] | null = null;

  columns = [
    { key: 'codigo', label: 'Código', type: 'text', width: '15%' },
    { key: 'descripcion', label: 'Descripción', type: 'text', width: '35%' },
    { key: 'cantidad', label: 'Cantidad', type: 'number', width: '15%' },
    { key: 'precioUnitario', label: 'Precio Unitario', type: 'number', width: '20%' },
    { key: 'acciones', label: 'Acciones', width: '15%' }
  ];

  @Input() set itemsData(items: any[] | null) {
    if (items && Array.isArray(items)) {
      if (this.items.length > 0) {
        this.pendingItemsToAdd = items;
        this.showConfirmModal = true;
      } else {
        this.setItems(items);
      }
    }
  }

  @Output() cargarRemitoStart = new EventEmitter<void>();
  @Output() cargarRemitoEnd = new EventEmitter<void>();

  private destroyed = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService) {
    this.tablaForm = this.fb.group({
      items: this.fb.array([])
    });
    // this.addItem(); // Eliminar para evitar fila vacía por defecto
  }

  get items() {
    return this.tablaForm.get('items') as FormArray;
  }

  setItems(items: any[]) {
    // Limpiar items actuales
    while (this.items.length) {
      this.items.removeAt(0);
    }
    // Agregar nuevos items
    for (const item of items) {
      const itemGroup = this.fb.group({
        codigo: [item.codigo ?? '', Validators.required],
        descripcion: [item.descripcion ?? '', Validators.required],
        cantidad: [item.cantidad ?? 1, [Validators.required, Validators.min(1)]],
        precioUnitario: [item.precio_unitario ?? item.precioUnitario ?? 0, [Validators.required, Validators.min(0)]]
      });
      this.items.push(itemGroup);
    }
    this.tablaForm.markAsPristine();
    this.tablaForm.markAsUntouched();
    this.tablaForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  addItem() {
    const itemGroup = this.fb.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    if (this.tablaForm.valid) {
      // Mostrar modal de confirmación
      this.showConfirmModal = true;
    }
  }

  confirmarGuardar() {
    // Aquí deberías obtener el nombre de la empresa del formulario o de otro lado
    // Por ahora, lo pediremos como campo en el primer item (puedes ajustar esto)
    const empresa = this.tablaForm.value.items[0]?.descripcion || 'Empresa';
    const fecha = new Date().toLocaleDateString();
    // Eliminar: this.remitosGuardados.push({
    // Eliminar:   empresa,
    // Eliminar:   fecha,
    // Eliminar:   items: JSON.parse(JSON.stringify(this.tablaForm.value.items)) // Clonar
    // Eliminar: });
    this.showConfirmModal = false;
    this.tablaForm.reset();
    this.items.clear();
    // Opcional: agregar una fila vacía tras guardar
    // this.addItem();
  }

  cancelarGuardar() {
    this.showConfirmModal = false;
  }

  cargarRemito(remito: any) {
    this.cargarRemitoStart.emit();
    // Simular carga asíncrona (puedes reemplazar por una llamada real si es necesario)
    setTimeout(() => {
      if (this.destroyed) return;
      this.setItems(remito.items);
      this.remitoSeleccionado = remito;
      this.cargarRemitoEnd.emit();
    }, 800); // 800ms de simulación de carga
  }

  exportarCSV() {
    if (!this.items.length) return;
    const header = this.columns.filter(c => c.key !== 'acciones').map(c => c.label);
    const rows: any[] = [];
    for (const itemCtrl of this.items.controls) {
      const item = itemCtrl.value;
      rows.push({
        Codigo: item.codigo,
        Descripcion: item.descripcion,
        Cantidad: item.cantidad,
        'Precio Unitario': item.precioUnitario
      });
    }
    const csvRows = [
      header.join(','),
      ...rows.map(row => [row.Codigo, row.Descripcion, row.Cantidad, row['Precio Unitario']].map(val => '"' + (val ?? '') + '"').join(','))
    ];
    const csvContent = csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'remitos.csv');
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  castFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  // Nueva función para cargar items (facturas) a la tabla
  cargarItems(items: any[]) {
    if (this.items.length > 0) {
      // Si ya hay datos, preguntar si desea agregar
      this.pendingItemsToAdd = items;
      this.showConfirmModal = true;
    } else {
      this.setItems(items);
    }
  }

  // Confirmar agregar items pendientes
  confirmarAgregarItems() {
    if (this.pendingItemsToAdd) {
      for (const item of this.pendingItemsToAdd) {
        const itemGroup = this.fb.group({
          codigo: [item.codigo ?? '', Validators.required],
          descripcion: [item.descripcion ?? '', Validators.required],
          cantidad: [item.cantidad ?? 1, [Validators.required, Validators.min(1)]],
          precioUnitario: [item.precio_unitario ?? item.precioUnitario ?? 0, [Validators.required, Validators.min(0)]]
        });
        this.items.push(itemGroup);
      }
      this.pendingItemsToAdd = null;
    }
    this.showConfirmModal = false;
  }

  cancelarAgregarItems() {
    this.pendingItemsToAdd = null;
    this.showConfirmModal = false;
  }

  // Limpiar tabla con confirmación
  mostrarModalLimpiar() {
    this.showClearModal = true;
  }
  confirmarLimpiarTabla() {
    this.items.clear();
    this.tablaForm.reset();
    this.showClearModal = false;
  }
  cancelarLimpiarTabla() {
    this.showClearModal = false;
  }
}
