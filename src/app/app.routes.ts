import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.component'),
    children: [
      {
        path: 'conversation',
        title: 'Conversation',
        loadComponent: () =>
          import('./chat/pages/conversation/conversation.component'),
      },
      {
        path: '',
        redirectTo: 'conversation',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
];
