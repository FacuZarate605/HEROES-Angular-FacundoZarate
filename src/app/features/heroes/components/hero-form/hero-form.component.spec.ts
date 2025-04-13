import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroFormComponent } from './hero-form.component';
import { HeroService } from '../../../../core/services/hero.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<HeroFormComponent>>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockHero = {
    id: 1,
    name: 'SPIDERMAN',
    powers: ['Trepar'],
    publisher: 'Marvel',
    firstAppearance: new Date('1962-08-01'),
    imageUrl: 'http://ejemplo.com/spiderman.jpg'
  };

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['addHero', 'updateHero']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        HeroFormComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { hero: null } },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar formulario vacío en modo creación', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.heroForm.value.name).toBe('');
    expect(component.heroForm.value.powers).toBe('');
    expect(component.heroForm.value.publisher).toBe('');
  });

  it('debería ser inválido cuando está vacío', () => {
    expect(component.heroForm.invalid).toBeTrue();
  });

  it('debería ser válido con datos correctos', () => {
    component.heroForm.patchValue({
      name: 'PRUEBA',
      powers: 'corre, salta',
      publisher: 'PRURBA',
      firstAppearance: '1962-08-01',
      imageUrl: 'http://ejemplo.com/test.jpg'
    });
    expect(component.heroForm.valid).toBeTrue();
  });

  it('debería cerrar el diálogo al cancelar', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('debería cargar datos del héroe en modo edición', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        HeroFormComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { hero: mockHero } },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    const editFixture = TestBed.createComponent(HeroFormComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();

    expect(editComponent.isEditMode).toBeTrue();
    expect(editComponent.heroForm.value.name).toBe(mockHero.name);
    expect(editComponent.heroForm.value.powers).toBe(mockHero.powers.join(', '));
  });
});