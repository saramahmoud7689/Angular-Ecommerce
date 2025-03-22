import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app/app.routes'; // Make sure routes are defined in `app.routes.ts`
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes)],
}).catch((err) => console.error(err));
