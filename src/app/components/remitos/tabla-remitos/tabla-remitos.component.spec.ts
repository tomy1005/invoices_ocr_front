import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRemitosComponent } from './tabla-remitos.component';

describe('TablaRemitosComponent', () => {
  let component: TablaRemitosComponent;
  let fixture: ComponentFixture<TablaRemitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaRemitosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaRemitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
