import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmDlgComponent } from './delete-confirm-dlg.component';

describe('DeleteConfirmDlgComponent', () => {
  let component: DeleteConfirmDlgComponent;
  let fixture: ComponentFixture<DeleteConfirmDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmDlgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteConfirmDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
