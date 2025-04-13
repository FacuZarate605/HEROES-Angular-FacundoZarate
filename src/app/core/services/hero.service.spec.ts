import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { HeroForm } from '../models/hero.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';

describe('HeroService', () => {
  let servicio: HeroService;

  const heroeMock = {
    id: 1,
    name: 'SPIDERMAN',
    powers: ['Trepar paredes'],
    publisher: 'Marvel',
    firstAppearance: new Date('1962-08-01'),
    imageUrl: 'assets/spiderman.jpg'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroService
      ]
    });

    servicio = TestBed.inject(HeroService);
    servicio['_heroes'].set([{ ...heroeMock }]);
  });

  it('debería crear el servicio correctamente', () => {
    expect(servicio).toBeTruthy();
  });

  describe('Operaciones básicas CRUD', () => {
    it('debería agregar un nuevo héroe con ID autoincremental', async () => {
      const nuevoHeroe: HeroForm = {
        name: 'IRONMAN',
        powers: ['Tecnología'],
        publisher: 'Marvel',
        firstAppearance: new Date(),
        imageUrl: ''
      };

      const resultado = await lastValueFrom(servicio.addHero(nuevoHeroe));

      expect(resultado.id).toBe(2);
      expect(resultado.name).toBe('IRONMAN');
      expect(servicio.heroes().length).toBe(2);
    });

    it('debería obtener todos los héroes', async () => {
      const heroes = await lastValueFrom(servicio.getHeroes());
      expect(heroes.length).toBe(1);
      expect(heroes[0].name).toBe('SPIDERMAN');
    });

    it('debería encontrar un héroe por ID', async () => {
      const heroe = await lastValueFrom(servicio.getHeroById(1));
      expect(heroe?.name).toBe('SPIDERMAN');
    });

    it('debería actualizar un héroe existente', async () => {
      const cambios = {
        name: 'SPIDER-MAN',
        powers: ['Velocidad'],
        publisher: 'Marvel',
        firstAppearance: new Date(),
        imageUrl: 'nueva-imagen.jpg'
      };

      const heroeActualizado = await lastValueFrom(
        servicio.updateHero(1, cambios)
      );

      expect(heroeActualizado.name).toBe('SPIDER-MAN');
      expect(heroeActualizado.powers).toContain('Velocidad');
      expect(servicio.heroes()[0].name).toBe('SPIDER-MAN');
    });

    it('debería eliminar un héroe existente', async () => {
      const resultado = await lastValueFrom(servicio.deleteHero(1));
      expect(resultado).toBeTrue();
      expect(servicio.heroes().length).toBe(0);
    });

    it('debería fallar al eliminar un héroe inexistente', async () => {
      const resultado = await lastValueFrom(servicio.deleteHero(999));
      expect(resultado).toBeFalse();
    });
  });
});