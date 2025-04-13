import { Component, computed, inject, signal } from '@angular/core';
import { HeroService } from '../../../../core/services/hero.service';
import { Hero } from '../../../../core/models/hero.model';
import { MatDialog } from '@angular/material/dialog';
import { HeroFormComponent } from '../../components/hero-form/hero-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTooltipModule,
    UppercaseDirective
  ]
})
export class HeroListComponent {
  private heroService = inject(HeroService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  heroes = this.heroService.heroes;
  loading = this.heroService.loading;
  searchControl = new FormControl('', { nonNullable: true });
  searchTerm = signal('');

  pageSize = signal(6);
  pageIndex = signal(0);
  pageSizeOptions = [6, 12, 18];

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchTerm.set(value);
      this.pageIndex.set(0);
    });
  }

  filteredHeroes = computed(() => {
    if (!this.searchTerm()) {
      return this.heroes();
    }
    return this.heroes().filter(hero =>
      hero.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });

  paginatedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredHeroes().slice(start, start + this.pageSize());
  });

  openAddDialog(): void {
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '600px',
      data: { hero: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshHeroes();
      }
    });
  }

  openEditDialog(hero: Hero): void {
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '600px',
      data: { hero }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshHeroes();
      }
    });
  }

  deleteHero(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Héroe',
        message: '¿Está seguro que desea eliminar este héroe?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.heroService.deleteHero(id).subscribe({
          next: () => {
            this.refreshHeroes();
            this.showSnackbar('Héroe eliminado exitosamente');
          },
          error: () => {
            this.showSnackbar('Error al eliminar el héroe');
          }
        });
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  private refreshHeroes(): void {
    this.heroService.getHeroes().subscribe(() => {
      this.pageIndex.set(0);
      this.searchControl.setValue('');
    });
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}