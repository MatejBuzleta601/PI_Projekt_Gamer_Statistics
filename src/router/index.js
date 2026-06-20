import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import GamesView from '../views/GamesView.vue'
import StatsView from '../views/StatsView.vue'
import SearchView from '../views/SearchView.vue'
import ProfileView from '../views/ProfileView.vue'
import FollowersView from '../views/FollowersView.vue'

const routes = [
    {
        path: '/login', component: LoginView, meta: { requiresGuest: true }
    },
    {
        path: '/register', component: RegisterView, meta: { requiresGuest: true }
    },
    {
        path: '/', component: HomeView, meta: { requiresAuth: true }
    },
    {
        path: '/games', component: GamesView, meta: { requiresAuth: true }
    },
    {
        path: '/stats', component: StatsView, meta: { requiresAuth: true }
    },
    {
        path: '/search', component: SearchView, meta: { requiresAuth: true }
    },
    {
        path: '/profile/:uid', component: ProfileView, meta: { requiresAuth: true }
    },
    {
        path: '/followers', component: FollowersView, meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const { useAuthStore } = await import('../stores/authStore')
    const authStore = useAuthStore()

    if (!authStore.authReady) {
        await new Promise((resolve) => {
            const unwatch = watch(
                () => authStore.authReady,
                (ready) => {
                    if (ready) {
                        unwatch()
                        resolve()
                    }
                }
            )
        })
    }

    if (to.meta.requiresAuth && !authStore.user) {
        next('/login')
    } else if (to.meta.requiresGuest && authStore.user) {
        next('/')
    } else {
        next()
    }
})

export default router