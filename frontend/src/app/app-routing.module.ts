import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {IdeasResolver} from "./resolvers/ideas.resolver";
import {IdeasComponent} from "./templates/ideas/ideas.component";
import {CreateIdeaComponent} from "./templates/create-idea/create-idea.component";
import {IdeaFillComponent} from "./templates/idea-fill/idea-fill.component";
import {IdeaResolver} from "./resolvers/idea.resolver";
import {HomeComponent} from "./templates/home/home.component";
import {TagsResolver} from "./resolvers/tags.resolver";
import {UpdateIdeaComponent} from "./templates/update-idea/update-idea.component";
import {AuthGuard} from "./security/auth.guard";
import {LoginComponent} from "./templates/login/login.component";
import {RegistrationComponent} from "./templates/registration/registration.component";
import {UserComponent} from "./templates/user/user.component";
import {UserResolver} from "./resolvers/user.resolver";
import {CurrentUserResolver} from "./resolvers/current-user.resolver";
import {SettingsComponent} from "./templates/settings/settings.component";
import {ProfileComponent} from "./templates/settings/profile/profile.component";
import {PostsResolver} from "./resolvers/posts.resolver";
import {NotifiesComponent} from "./templates/settings/notifies/notifies.component";
import {InterfaceComponent} from "./templates/settings/interface/interface.component";
import {SecureComponent} from "./templates/settings/secure/secure.component";
import {UserProfileComponent} from "./templates/user/profile/user-profile.component";
import {UserIdeasComponent} from "./templates/user/ideas/user-ideas.component";
import {UserContactsComponent} from "./templates/user/contacts/user-contacts.component";
import {AdminComponent} from "./templates/admin/admin.component";
import {AdminUsersComponent} from "./templates/admin/admin-users/admin-users.component";
import {UsersResolver} from "./resolvers/users.resolver";
import {AdminGuard} from "./security/admin.guard";
import {AdminTagsComponent} from "./templates/admin/admin-tags/admin-tags.component";
import {AdminPostsComponent} from "./templates/admin/admin-posts/admin-posts.component";
import {UpdateIdeaGuard} from "./security/update-idea.guard";
import {LoginGuard} from "./security/login.guard";
import {HomeContentComponent} from "./templates/home/home-content/home-content.component";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { animation: 'home' },
        canActivate: [AuthGuard],
        resolve: {
            currentUser: CurrentUserResolver
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: HomeContentComponent,
            },
            {
                path: 'ideas',
                component: IdeasComponent,
                data: { animation: 'ideas' },
                canActivate: [AuthGuard],
                resolve: {
                    ideas: IdeasResolver,
                    tags: TagsResolver,
                    currentUser: CurrentUserResolver
                },
            },
            {
                path: 'ideas/id/:id',
                component: IdeaFillComponent,
                data: { animation: 'idea' },
                canActivate: [AuthGuard],
                resolve: {
                    idea: IdeaResolver,
                    currentUser: CurrentUserResolver,
                }
            },
            {
                path: 'ideas/create',
                component: CreateIdeaComponent,
                data: { animation: 'idea-create' },
                canActivate: [AuthGuard],
                resolve: {
                    tags: TagsResolver,
                    currentUser: CurrentUserResolver
                }
            },
            {
                path: 'ideas/update/:id',
                component: UpdateIdeaComponent,
                data: { animation: 'update-idea' },
                canActivate: [AuthGuard, UpdateIdeaGuard],
                resolve: {
                    idea: IdeaResolver,
                    tags: TagsResolver,
                    currentUser: CurrentUserResolver
                }
            },
            {
                path: 'profile',
                component: UserComponent,
                data: { animation: 'profile' },
                canActivate: [AuthGuard],
                resolve: {
                    currentUser: CurrentUserResolver,
                },
            },
            {
                path: 'settings',
                component: SettingsComponent,
                data: { animation: 'settings' },
                canActivate: [AuthGuard],
                resolve: {
                    currentUser: CurrentUserResolver
                },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'profile'
                    },
                    {
                        path: 'profile',
                        component: ProfileComponent,
                        data: { animation: 'profile' },
                        resolve: {
                            currentUser: CurrentUserResolver,
                            posts: PostsResolver,
                        }
                    },
                    {
                        path: 'notifies',
                        component: NotifiesComponent,
                        data: { animation: 'notifies' },
                        resolve: {
                            currentUser: CurrentUserResolver,
                        }
                    },
                    {
                        path: 'interface',
                        component: InterfaceComponent,
                        data: { animation: 'interface' },
                        resolve: {
                            currentUser: CurrentUserResolver,
                        }
                    },
                    {
                        path: 'secure',
                        component: SecureComponent,
                        data: { animation: 'secure' },
                        resolve: {
                            currentUser: CurrentUserResolver,
                        }
                    }
                ]
            },
            {
                path: 'user/:id',
                component: UserComponent,
                data: { animation: 'user' },
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'profile'
                    },
                    {
                        path: 'profile',
                        component: UserProfileComponent,
                        data: { animation: 'profile' },
                        resolve: {
                            user: UserResolver
                        }
                    },
                    {
                        path: 'ideas',
                        component: UserIdeasComponent,
                        data: { animation: 'ideas' },
                        resolve: {
                            user: UserResolver
                        }
                    },
                    {
                        path: 'contacts',
                        component: UserContactsComponent,
                        data: { animation: 'contacts' },
                        resolve: {
                            user: UserResolver
                        }
                    }
                ]
            },
            {
                path: 'admin',
                component: AdminComponent,
                data: { animation: 'admin' },
                canActivate: [AdminGuard],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'users'
                    },
                    {
                        path: 'users',
                        component: AdminUsersComponent,
                        data: { animation: 'users' },
                        resolve: {
                            users: UsersResolver,
                            posts: PostsResolver,
                            currentUser: CurrentUserResolver
                        }
                    },
                    {
                        path: 'tags',
                        component: AdminTagsComponent,
                        data: { animation: 'tags' },
                        resolve: {
                            tags: TagsResolver
                        }
                    },
                    {
                        path: 'posts',
                        component: AdminPostsComponent,
                        data: { animation: 'posts' },
                        resolve: {
                            posts: PostsResolver
                        }
                    }
                ]
            }
        ]
    },
    {
        path: 'auth',
        component: LoginComponent,
        data: { animation: 'auth' },
        canActivate: [LoginGuard],
    },
    {
        path: 'registration',
        component: RegistrationComponent,
        data: { animation: 'registration' },
        canActivate: [LoginGuard],
        resolve: {
            posts: PostsResolver
        }
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}