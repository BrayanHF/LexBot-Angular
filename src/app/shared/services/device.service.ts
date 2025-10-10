import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private bpo = inject(BreakpointObserver);

  public isMobile = toSignal(
    this.bpo.observe([ '(max-width: 767px)' ]).pipe(
      map(res => res.matches)
    ),
    { initialValue: false }
  );

}
