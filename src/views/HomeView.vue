<script setup>
    import { useAuthStore } from '../stores/authStore'

    const authStore = useAuthStore()

</script>

<template>
    <div class="min-h-screen bg-blue-200 flex flex-col items-center justify-center gap-6">
        <img
            src="../assets/GamerStatisticsLogoVersion2.png"
            alt="GamerStatistics Logo"
            class="h-70 object-contain"
        />

        <div class="bg-blue-800 rounded-xl p-10 w-full max-w-lg text-center">
            <h1 class="text-white text-3xl font-bold">
                Dobrodošao, {{ authStore.userProfile?.username }}
            </h1>
            <p class="text-blue-300 mt-4 text-lg">
                Ova aplikacija omogućuje takozvani gamer journal, gdje možete bilježiti sve igre koje igrate, aplikacija će vam prikazati što najviše volite i omogućiti uređivanje te kolekcije.
            </p>
        </div>
    </div>
</template>