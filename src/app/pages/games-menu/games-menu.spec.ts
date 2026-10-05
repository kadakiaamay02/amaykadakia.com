import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesMenu } from './games-menu';

describe('GamesMenu', () => {
  let component: GamesMenu;
  let fixture: ComponentFixture<GamesMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
