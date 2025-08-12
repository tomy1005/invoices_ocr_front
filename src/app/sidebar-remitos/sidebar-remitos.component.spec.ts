import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRemitosComponent } from './sidebar-remitos.component';

describe('SidebarRemitosComponent', () => {
  let component: SidebarRemitosComponent;
  let fixture: ComponentFixture<SidebarRemitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarRemitosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarRemitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
