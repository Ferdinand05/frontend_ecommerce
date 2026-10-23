import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import AuthLayout from "@/views/layouts/AuthLayout.vue";
import type { RouteRecordRaw } from "vue-router";


export const authRoutes : RouteRecordRaw[] = [
    {
        path:"/",
        component:AuthLayout,
        children : [
        {
        path: 'login',
        name: 'login',
        component: LoginView,
        meta: {
          guestOnly: true,
          title : "Login"
        },
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterView,
        meta: {
          guestOnly: true,
          title : "Register"
        },
      },
        ]
    }
]