import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class NgxSpinnerHttpInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private spinner: NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.requests.length === 0) {
      this.spinner.show();
    }
    this.requests.push(req);
    return next.handle(req).pipe(
      finalize(() => {
        this.requests = this.requests.filter(r => r !== req);
        if (this.requests.length === 0) {
          this.spinner.hide();
        }
      })
    );
  }
} 