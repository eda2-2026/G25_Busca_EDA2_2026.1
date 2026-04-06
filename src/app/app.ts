import { Component, inject, signal } from '@angular/core';
import { BuscaBinariaService } from './services/busca-binaria.service';
import type { IdAba, Medicamento, ResultadoBuscaExato } from './models/farmacia.models';

@Component({
  selector: 'ng-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly busca = inject(BuscaBinariaService);

  protected readonly abaAtiva = signal<IdAba>('busca');
  protected readonly termoConsulta = signal('');
  protected readonly painelResultado = signal<ResultadoBuscaExato | null>(null);

  protected readonly estoque = this.busca.estoque;
  protected readonly quantidadeMaximaEstoque = Math.max(
    ...this.busca.estoque.map((e) => e.quantidade),
    1,
  );

  protected sugestoesNaoEncontrado(): Medicamento[] {
    const r = this.painelResultado();
    const t = this.termoConsulta();
    if (!r || r.encontrado) return [];
    return this.busca.buscarNomesSimilares(this.estoque, t);
  }

  onDigitarBusca(valor: string): void {
    this.termoConsulta.set(valor);
    if (valor.length >= 3) {
      this.painelResultado.set(this.busca.buscaBinariaPorNome(this.estoque, valor));
    } else if (!valor) {
      this.painelResultado.set(null);
    }
  }

  executarBusca(): void {
    const t = this.termoConsulta().trim();
    if (!t) return;
    this.painelResultado.set(this.busca.buscaBinariaPorNome(this.estoque, t));
  }

  mostrarAba(id: IdAba): void {
    this.abaAtiva.set(id);
  }

  selecionarSugestao(nome: string): void {
    this.termoConsulta.set(nome);
    this.painelResultado.set(this.busca.buscaBinariaPorNome(this.estoque, nome));
  }

  classeBadgeLista(q: number): 'badge-out' | 'badge-low' | 'badge-ok' {
    if (q === 0) return 'badge-out';
    if (q < 10) return 'badge-low';
    return 'badge-ok';
  }

  textoBadgeLista(q: number): string {
    if (q === 0) return 'Esgotado';
    if (q < 10) return 'Baixo';
    return 'OK';
  }

  textoBadgeResultado(q: number): string {
    if (q === 0) return 'Sem estoque';
    if (q < 10) return 'Estoque baixo';
    return 'Disponível';
  }

  classeBarraVisual(indice: number): string {
    const r = this.painelResultado();
    if (!r) return '';
    const estado = r.estadoVisual[indice] ?? 'ocioso';
    if (estado === 'encontrado') return 'found';
    if (estado === 'eliminado') return 'eliminated';
    if (estado === 'ativo') return 'active';
    return '';
  }

  larguraBarraPercentual(item: Medicamento, indice: number): number {
    const r = this.painelResultado();
    const base = Math.max(
      4,
      Math.round((item.quantidade / this.quantidadeMaximaEstoque) * 100),
    );
    if (!r) return base;
    const estado = r.estadoVisual[indice] ?? 'ocioso';
    return estado === 'eliminado' ? 100 : base;
  }

  rotuloPassoNoIndice(indice: number): string {
    const r = this.painelResultado();
    if (!r) return '';
    const p = r.passos.find((x) => x.indiceMeio === indice);
    return p ? '#' + p.numeroPasso : '';
  }

  primeiroNomeMedicamento(nome: string): string {
    return nome.split(' ')[0] ?? nome;
  }

  rotuloDecisaoPasso(comparacao: number): { texto: string; classe: 'hit' | 'right' | 'left' } {
    if (comparacao === 0) return { texto: 'Encontrado!', classe: 'hit' };
    if (comparacao < 0) return { texto: 'Ir à direita ▶', classe: 'right' };
    return { texto: '◀ Ir à esquerda', classe: 'left' };
  }
}
