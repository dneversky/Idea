import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatBadgeModule} from "@angular/material/badge";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {IdeaService} from "./services/idea.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { IdeasComponent } from './ideas/ideas.component';
import { IdeaComponent } from './idea/idea.component';
import {MatMenuModule} from "@angular/material/menu";
import {AppRoutingModule} from "./app-routing.module";
import { CreateIdeaComponent } from './create-idea/create-idea.component';
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {SearchPipe} from "./pipes/ideas-filter/search.pipe";

@NgModule({
  declarations: [
    AppComponent,
    IdeasComponent,
    IdeaComponent,
    CreateIdeaComponent,
      SearchPipe
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        MatSidenavModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatDividerModule,
        MatListModule,
        MatBadgeModule,
        MatCardModule,
        MatGridListModule,
        MatMenuModule,

        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule,
        MatInputModule,
        MatPaginatorModule,
        FormsModule,
    ],
  providers: [IdeaService],
  bootstrap: [AppComponent]
})
export class AppModule { }