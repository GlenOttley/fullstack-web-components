import { Route } from './router';

export const routes: Route[] = [
  {
    path: '/',
    component: 'main',
    tag: 'main-view',
    title: 'In',
  },
  {
    path: '/login',
    component: 'login',
    tag: 'login-view',
    title: 'Login',
  },
  {
    path: '/dashboard',
    component: 'dashboard',
    tag: 'dashboard-view',
    title: 'Contact Dashboard',
  },
];
