import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {IdeasResolver} from "./shared/resolvers/ideas.resolver";
import {IdeasComponent} from "./ideas/ideas.component";
import {CreateIdeaComponent} from "./create-idea/create-idea.component";
import {IdeaFillComponent} from "./idea-fill/idea-fill.component";
import {IdeaResolver} from "./shared/resolvers/idea.resolver";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'ideas',
        pathMatch: 'full',
        component: IdeasComponent,
        resolve: {
            ideas: IdeasResolver
        },
        children: [
            {
                path: ':id',
                component: IdeaFillComponent,
                resolve: {
                    idea: IdeaResolver
                }
            }
        ]
    },
    {
        path: 'ideas/create',
        component: CreateIdeaComponent
    }

]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}