import Vue from 'vue';
import Router from 'vue-router';

import SignIn from '../components/Authentification/SignIn.vue';

import DashboardWrapper from '../components/Dashboard/Wrapper.vue';
import DashboardMain from '../components/Dashboard/Main.vue';
import DashboardSettings from '../components/Dashboard/Settings.vue';
import DashboardTasks from '../components/Dashboard/Tasks/Tasks.vue';

import ClientMain from '../components/Client/Main.vue';
import ClientSqr from '../components/Client/Sqr.vue';
import ClientPpr from '../components/Client/Ppr.vue';
import ClientOnboarding from '../components/Client/Onboarding.vue';

Vue.use(Router);

const routes = [
  {
    path: '',
    name: 'Sign In',
    component: SignIn,
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    component: DashboardWrapper,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard Main', component: DashboardMain },
      { path: 'tasks', name: 'Dashboard Tasks', component: DashboardTasks },
      { path: 'settings', name: 'Dashboard Settings', component: DashboardSettings },
    ],
  },
  {
    path: '/client/:id',
    component: DashboardWrapper,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Client Main', component: ClientMain },
      { path: 'sqr', name: 'Client Sqr', component: ClientSqr },
      { path: 'ppr', name: 'Client Ppr', component: ClientPpr },
      { path: 'tasks', name: 'Client Tasks', component: DashboardTasks },
      { path: 'onboarding', name: 'Client Onboarding', component: ClientOnboarding },
    ],
  },
];

const router = new Router({ routes, mode: 'history' });

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requiresAuth)) {
    const userToken = window.localStorage.getItem('userToken');
    if (!userToken) {
      next({ name: 'Sign In' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
