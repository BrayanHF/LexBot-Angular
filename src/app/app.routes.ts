import { Routes } from '@angular/router';

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
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
];
