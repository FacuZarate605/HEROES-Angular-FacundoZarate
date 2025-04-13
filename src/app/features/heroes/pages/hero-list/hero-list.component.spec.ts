import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';
import { HeroService } from '../../../../core/services/hero.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockHeroes = [{
    id: 1,
    name: 'SPIDERMAN',
    powers: ['Trepar'],
    publisher: 'Marvel',
    firstAppearance: new Date('1962-08-01'),
    imageUrl: 'http://ejemplo.com/spiderman.jpg'
  }];

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getHeroes'], {
      heroes: signal(mockHeroes),
      loading: signal(false)
    });

    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        HeroListComponent,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    mockHeroService.getHeroes.and.returnValue(of(mockHeroes));
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar los héroes recibidos del servicio', () => {
    expect(component.heroes().length).toBe(1);
    expect(component.heroes()[0].name).toBe('SPIDERMAN');
  });

  it('debería filtrar héroes al buscar', () => {
    component.searchTerm.set('spider');
    expect(component.filteredHeroes().length).toBe(1);
  });

  it('debería mostrar todos los héroes cuando la búsqueda está vacía', () => {
    component.searchTerm.set('');
    expect(component.filteredHeroes().length).toBe(1);
  });
});