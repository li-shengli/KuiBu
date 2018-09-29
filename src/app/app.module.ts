import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent }  from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NewTaskComponent } from './new-task/new-task.component';
import {MatCardModule} from '@angular/material/card';
import {ChartModule} from 'angular-highcharts';

import { routing }        from './app.routing';
import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
// import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService, TaskService } from './_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
// import { fakeBackendProvider } from './_helpers';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConnectUsComponent } from './connect-us/connect-us.component';

@NgModule({
  declarations: [
    AppComponent,
    NewTaskComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ConnectUsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    ChartModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
  ],
  entryComponents: [
    NewTaskComponent,
    ConnectUsComponent
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    TaskService
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
