import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HeroService } from '../services/hero.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const heroService = inject(HeroService);

  heroService.setLoading(true);

  return next(req).pipe(
    finalize(() => heroService.setLoading(false))
  );
};