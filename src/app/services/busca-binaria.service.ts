import { Injectable } from '@angular/core';
import type {
  EstadoVisualBarra,
  Medicamento,
  PassoBusca,
  ResultadoBuscaExato,
} from '../models/farmacia.models';
import { ESTOQUE_MEDICAMENTOS_ORDENADO } from '../data/estoque-medicamentos';

@Injectable({ providedIn: 'root' })
export class BuscaBinariaService {
  readonly estoque = ESTOQUE_MEDICAMENTOS_ORDENADO;

  buscaBinariaPorNome(
    listaOrdenada: Medicamento[],
    textoPesquisado: string,
  ): ResultadoBuscaExato {
    const termo = textoPesquisado.trim().toLowerCase();
    let indiceInicio = 0;
    let indiceFim = listaOrdenada.length - 1;
    const passos: PassoBusca[] = [];
    const estadoVisual: EstadoVisualBarra[] = listaOrdenada.map(() => 'ocioso');

    while (indiceInicio <= indiceFim) {
      const indiceMeio = Math.floor((indiceInicio + indiceFim) / 2);
      const comparacao = listaOrdenada[indiceMeio].nome
        .toLowerCase()
        .localeCompare(termo);

      passos.push({
        numeroPasso: passos.length + 1,
        indiceInicio,
        indiceFim,
        indiceMeio,
        nomeComparado: listaOrdenada[indiceMeio].nome,
        comparacao,
      });

      if (comparacao === 0) {
        estadoVisual[indiceMeio] = 'encontrado';
        for (let i = 0; i < listaOrdenada.length; i++) {
          if (i !== indiceMeio) estadoVisual[i] = 'eliminado';
        }
        return {
          encontrado: true,
          indice: indiceMeio,
          item: listaOrdenada[indiceMeio],
          passos,
          estadoVisual,
        };
      }

      if (comparacao < 0) {
        for (let i = indiceInicio; i < indiceMeio; i++) estadoVisual[i] = 'eliminado';
        indiceInicio = indiceMeio + 1;
      } else {
        for (let i = indiceMeio + 1; i <= indiceFim; i++) estadoVisual[i] = 'eliminado';
        indiceFim = indiceMeio - 1;
      }
    }

    return { encontrado: false, passos, estadoVisual };
  }

  buscarNomesSimilares(lista: Medicamento[], textoPesquisado: string): Medicamento[] {
    const termo = textoPesquisado.trim().toLowerCase();
    return lista.filter((item) => item.nome.toLowerCase().includes(termo)).slice(0, 5);
  }

  escaparParaHtml(texto: string): string {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }
}
