import LoginView from "@/views/auth/LoginView.vue";
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import EmailVerificationView from "@/views/auth/EmailVerificationView.vue";
import ResetPasswordView from "@/views/auth/ResetPasswordView.vue";
import AuthLayout from "@/views/layouts/AuthLayout.vue";
import type { RouteRecordRaw } from "vue-router";


export const authRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        component: AuthLayout,
        children: [
            {
                path: '/login',
                name: 'login',
                component: LoginView,
                meta: { guestOnly: true, title: 'Login' },
            },
            {
                path: '/forgot-password',
                name: 'forgot-password',
                component: ForgotPasswordView,
                meta: { guestOnly: true, title: 'Forgot password' },
            },
            {
                path: '/register',
                name: 'register',
                component: RegisterView,
                meta: { guestOnly: true, title: 'Register' },
            },
            {
                path: '/auth/email-verification/verify',
                name: 'email-verification',
                component: EmailVerificationView,
                meta: { title: 'Verify email' },
            },
            {
                path: '/reset-password',
                name: 'reset-password',
                component: ResetPasswordView,
                meta: { title: 'Reset password' },
            },
        ],
    },
]