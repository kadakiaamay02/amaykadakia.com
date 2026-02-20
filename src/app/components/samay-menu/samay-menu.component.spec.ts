import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamayMenuComponent } from './samay-menu.component';

describe('SamayMenuComponent', () => {
  let component: SamayMenuComponent;
  let fixture: ComponentFixture<SamayMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamayMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SamayMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
