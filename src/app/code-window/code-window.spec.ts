import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeWindow } from './code-window';

describe('CodeWindow', () => {
  let component: CodeWindow;
  let fixture: ComponentFixture<CodeWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
