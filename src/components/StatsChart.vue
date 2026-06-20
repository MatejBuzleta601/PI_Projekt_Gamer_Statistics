<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const props = defineProps({
    type: String,
    data: Array
})

const gamesChartData = {
    labels: props.data.map(g => g.name || g.genre),
    datasets: [{
        label: 'Sati',
        data: props.data.map(g => g.hours),
        backgroundColor: ['#f87171', '#fb923c', '#facc15']
    }]
}

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
        labels: { color: '#93c5fd' }
        }
    },
    scales: {
        x: { ticks: { color: '#93c5fd' }, grid: { color: '#1e3a8a' } },
        y: { ticks: { color: '#93c5fd' }, grid: { color: '#1e3a8a' } }
    }
}

const doughnutOptions = {
    responsive: true,
    plugins: {
        legend: {
        labels: { color: '#93c5fd' }
        }
    }
}
</script>

<template>
    <Bar v-if="type === 'bar'" :data="gamesChartData" :options="chartOptions" />
    <Doughnut v-else :data="gamesChartData" :options="doughnutOptions" />
</template>