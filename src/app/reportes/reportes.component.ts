import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import {
  ConvocatoriasCategoriaReporte,
  PostulacionesConvocatoriaReporte,
  ResultadoPostulacionesReporte
} from '../core/models/reporte.model';
import { ReporteService } from '../core/services/reporte.service';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  private readonly reporteService = inject(ReporteService);

  readonly convocatoriasCategoria = signal<ConvocatoriasCategoriaReporte[]>([]);
  readonly postulacionesConvocatoria = signal<PostulacionesConvocatoriaReporte[]>([]);
  readonly resultadoPostulaciones = signal<ResultadoPostulacionesReporte[]>([]);
  readonly cargando = signal(false);
  readonly mensajeError = signal('');
  readonly mostrarConvocatoriasCategoria = signal(true);
  readonly mostrarPostulacionesConvocatoria = signal(true);
  readonly mostrarResultadoPostulaciones = signal(true);
  readonly barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  readonly doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  readonly convocatoriasCategoriaChart = computed<ChartData<'bar'>>(() => ({
    labels: this.convocatoriasCategoria().map((item) => item.categoriaNombre),
    datasets: [
      {
        data: this.convocatoriasCategoria().map((item) => item.totalConvocatorias),
        label: 'Convocatorias',
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  }));
  readonly postulacionesConvocatoriaChart = computed<ChartData<'bar'>>(() => ({
    labels: this.postulacionesConvocatoria().map((item) => item.convocatoriaNombre),
    datasets: [
      {
        data: this.postulacionesConvocatoria().map((item) => item.totalPostulaciones),
        label: 'Postulaciones',
        backgroundColor: '#0f766e',
        borderColor: '#0f5f59',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  }));
  readonly resultadoPostulacionesChart = computed<ChartData<'doughnut'>>(() => ({
    labels: this.resultadoPostulaciones().map((item) => item.estadoNombre),
    datasets: [
      {
        data: this.resultadoPostulaciones().map((item) => item.totalPostulaciones),
        backgroundColor: ['#16a34a', '#dc2626'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  }));

  constructor() {
    this.cargarReportes();
  }

  alternarConvocatoriasCategoria(): void {
    this.mostrarConvocatoriasCategoria.update((valor) => !valor);
  }

  alternarPostulacionesConvocatoria(): void {
    this.mostrarPostulacionesConvocatoria.update((valor) => !valor);
  }

  alternarResultadoPostulaciones(): void {
    this.mostrarResultadoPostulaciones.update((valor) => !valor);
  }

  cargarReportes(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    forkJoin({
      convocatoriasCategoria: this.reporteService.convocatoriasPorCategoria(),
      postulacionesConvocatoria: this.reporteService.postulacionesPorConvocatoria(),
      resultadoPostulaciones: this.reporteService.resultadoPostulaciones()
    }).subscribe({
      next: (reportes) => {
        this.convocatoriasCategoria.set(reportes.convocatoriasCategoria);
        this.postulacionesConvocatoria.set(reportes.postulacionesConvocatoria);
        this.resultadoPostulaciones.set(reportes.resultadoPostulaciones);
        this.cargando.set(false);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.message ?? 'No fue posible cargar los reportes.');
        this.cargando.set(false);
      }
    });
  }
}
