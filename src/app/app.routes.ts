import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chat',
    loadComponent: () => import('./conversation/conversation.component'),
    children: [
      {
        path: '',
        title: 'New Chat',
        loadComponent: () => import('./conversation/pages/new-chat/new-chat.component'),
      },
      {
        path: 'c/:chatId',
        title: 'Conversation',
        loadComponent: () => import('./conversation/pages/chat/chat.component'),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
];
