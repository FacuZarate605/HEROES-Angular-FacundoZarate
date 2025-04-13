import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Hero, HeroForm } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    UppercaseDirective
  ]
})
export class HeroFormComponent {
  private fb = inject(FormBuilder);
  private heroService = inject(HeroService);
  private dialogRef = inject(MatDialogRef<HeroFormComponent>);
  private snackBar = inject(MatSnackBar);

  heroForm: FormGroup;
  isEditMode = false;
  loading = signal(false);
  defaultImage = 'assets/spiderman.jpg';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { hero: Hero | null }
  ) {
    this.isEditMode = !!this.data.hero;
    this.heroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      alias: [''],
      powers: ['', Validators.required],
      publisher: ['', Validators.required],
      firstAppearance: ['', Validators.required],
      imageUrl: [this.defaultImage]
    });

    if (this.isEditMode && this.data.hero) {
      const { id, ...hero } = this.data.hero;
      this.heroForm.patchValue({
        ...hero,
        powers: Array.isArray(hero.powers) ? hero.powers.join(', ') : hero.powers,
        firstAppearance: hero.firstAppearance instanceof Date
          ? hero.firstAppearance
          : new Date(hero.firstAppearance)
      });
    }
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      return;
    }

    this.loading.set(true);
    const formValue = this.heroForm.value;

    const powersArray = (typeof formValue.powers === 'string'
      ? formValue.powers.split(',')
      : formValue.powers).map((p: string) => p.trim());

    const heroData: HeroForm = {
      name: formValue.name,
      alias: formValue.alias,
      powers: powersArray,
      publisher: formValue.publisher,
      firstAppearance: new Date(formValue.firstAppearance),
      imageUrl: formValue.imageUrl || this.defaultImage
    };

    const operation = this.isEditMode
      ? this.heroService.updateHero(this.data.hero!.id, heroData)
      : this.heroService.addHero(heroData);

    operation.subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.showSnackbar(
          `Héroe ${this.isEditMode ? 'actualizado' : 'agregado'} exitosamente`
        );
      },
      error: () => {
        this.loading.set(false);
        this.showSnackbar(
          `Error ${this.isEditMode ? 'actualizando' : 'agregando'} el héroe`
        );
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}