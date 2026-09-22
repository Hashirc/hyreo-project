import { Injectable, NgZone, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private zone = inject(NgZone);
  private eventSource: EventSource | null = null;

  readonly productChanged$ = new Subject<any>();
  readonly categoryChanged$ = new Subject<any>();
  readonly offerChanged$ = new Subject<any>();
  readonly orderChanged$ = new Subject<any>();

  init() {
    if (this.eventSource) return;

    const url = `${environment.apiUrl}/realtime/stream`;

    this.zone.runOutsideAngular(() => {
      this.eventSource = new EventSource(url);

      this.eventSource.addEventListener('product_change', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          this.zone.run(() => this.productChanged$.next(data));
        } catch {}
      });

      this.eventSource.addEventListener('category_change', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          this.zone.run(() => this.categoryChanged$.next(data));
        } catch {}
      });

      this.eventSource.addEventListener('offer_change', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          this.zone.run(() => this.offerChanged$.next(data));
        } catch {}
      });

      this.eventSource.addEventListener('order_change', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          this.zone.run(() => this.orderChanged$.next(data));
        } catch {}
      });

      this.eventSource.onerror = () => {
        console.warn('[RealtimeService] SSE connection error, will retry automatically.');
      };
    });
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
