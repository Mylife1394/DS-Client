import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizationStringComponent } from './localization-string.component';

describe('LocalizationStringComponent', () => {
  let component: LocalizationStringComponent;
  let fixture: ComponentFixture<LocalizationStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizationStringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalizationStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
