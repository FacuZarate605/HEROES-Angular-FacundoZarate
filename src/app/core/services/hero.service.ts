import { Injectable, signal, computed } from '@angular/core';
import { Observable, delay, of, throwError, finalize } from 'rxjs';
import { Hero, HeroForm } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private _heroes = signal<Hero[]>([
    {
      id: 1,
      name: 'SPIDERMAN',
      alias: 'Peter Parker',
      powers: ['Trepar paredes', 'Sentido arácnido', 'Súper fuerza'],
      publisher: 'Marvel',
      firstAppearance: new Date('1962-08-01'),
      imageUrl: 'assets/images/spiderman.jpg'
    },
    {
      id: 2,
      name: 'SUPERMAN',
      alias: 'Clark Kent',
      powers: ['Súper fuerza', 'Volar', 'Visión láser', 'Regeneración'],
      publisher: 'DC',
      firstAppearance: new Date('1938-06-01'),
      imageUrl: 'assets/images/superman.jpg'
    },
    {
      id: 3,
      name: 'BATMAN',
      alias: 'Bruce Wayne',
      powers: ['Inteligencia', 'Artes marciales', 'Riqueza'],
      publisher: 'DC',
      firstAppearance: new Date('1939-05-01'),
      imageUrl: 'assets/images/batman.jpg'
    },
    {
      id: 4,
      name: 'MUJER MARAVILLA',
      alias: 'Diana Prince',
      powers: ['Súper fuerza', 'Inteligencia', 'Volar'],
      publisher: 'DC',
      firstAppearance: new Date('1941-12-01'),
      imageUrl: 'assets/images/wonderwoman.jpg'
    },
    {
      id: 5,
      name: 'IRONMAN',
      alias: 'Tony Stark',
      powers: ['Inteligencia', 'Armadura protectora', 'Riqueza'],
      publisher: 'Marvel',
      firstAppearance: new Date('1963-03-01'),
      imageUrl: 'assets/images/ironman.jpg'
    },
    {
      id: 6,
      name: 'CAPITÁN AMÉRICA',
      alias: 'Steve Rogers',
      powers: ['Fuerza', 'Lucha', 'Regeneración'],
      publisher: 'Marvel',
      firstAppearance: new Date('1931-07-01'),
      imageUrl: 'assets/images/capitanamerica.jpg'
    }
  ]);

  private _loading = signal(false);
  loading = this._loading.asReadonly();
  heroes = computed(() => this._heroes());
  private defaultImage = 'assets/images/empty.jpg';

  private simulateLoading<T>(data: T): Observable<T> {
    this._loading.set(true);
    return of(data).pipe(
      delay(500),
      finalize(() => this._loading.set(false))
    );
  }

  setLoading(state: boolean): void {
    this._loading.set(state);
  }

  getHeroes(): Observable<Hero[]> {
    return this.simulateLoading([...this._heroes()]);
  }

  getHeroById(id: number): Observable<Hero | undefined> {
    const hero = this._heroes().find(h => h.id === id);
    return this.simulateLoading(hero ? { ...hero } : undefined);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return this.getHeroes();
    }
    const filtered = this._heroes().filter(hero =>
      hero.name.toLowerCase().includes(term.toLowerCase())
    );
    return this.simulateLoading(filtered);
  }

  addHero(hero: HeroForm): Observable<Hero> {
    const newHero: Hero = {
      ...hero,
      id: Math.max(...this._heroes().map(h => h.id), 0) + 1,
      imageUrl: this.defaultImage
    };
    this._heroes.update(heroes => [newHero, ...heroes]);
    return this.simulateLoading(newHero);
  }

  updateHero(id: number, hero: HeroForm): Observable<Hero> {
    const index = this._heroes().findIndex(h => h.id === id);
    if (index === -1) {
      return throwError(() => new Error('Héroe no encontrado'));
    }
    const updatedHero = { ...hero, id };
    this._heroes.update(heroes =>
      heroes.map(h => h.id === id ? updatedHero : h)
    );
    return this.simulateLoading(updatedHero);
  }

  deleteHero(id: number): Observable<boolean> {
    const initialLength = this._heroes().length;
    this._heroes.update(heroes => heroes.filter(hero => hero.id !== id));
    return this.simulateLoading(this._heroes().length < initialLength);
  }
}