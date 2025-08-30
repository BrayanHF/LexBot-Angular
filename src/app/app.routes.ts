import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'chat',
    loadComponent: () => import('./conversation/conversation.component'),
    children: [
      {
        path: '',
        title: 'Nuevo Chat',
        loadComponent: () => import('./conversation/pages/new-chat/new-chat.component'),
      },
      {
        path: 'c/:chatId',
        title: 'Chat',
        loadComponent: () => import('./conversation/pages/chat/chat.component'),
      },
      {
        path: 'generate/:document',
        title: 'Generar Documento',
        loadComponent: () => import('./conversation/pages/generate-document/generate-document.component')
      }
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
    children: [
      {
        path: 'login',
        title: 'Iniciar Sesion',
        loadComponent: () => import('./auth/pages/login/login.component'),
      },
      {
        path: 'register',
        title: 'Registrate',
        loadComponent: () => import('./auth/pages/register/register.component'),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'chat',
    pathMatch: 'full',
  }
];
