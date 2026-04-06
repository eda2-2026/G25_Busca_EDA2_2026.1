export interface Medicamento {
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
}

export type EstadoVisualBarra = 'ocioso' | 'encontrado' | 'eliminado' | 'ativo';

export interface PassoBusca {
  numeroPasso: number;
  indiceInicio: number;
  indiceFim: number;
  indiceMeio: number;
  nomeComparado: string;
  comparacao: number;
}

export type ResultadoBuscaExato =
  | {
      encontrado: true;
      indice: number;
      item: Medicamento;
      passos: PassoBusca[];
      estadoVisual: EstadoVisualBarra[];
    }
  | {
      encontrado: false;
      passos: PassoBusca[];
      estadoVisual: EstadoVisualBarra[];
    };

export type IdAba = 'busca' | 'estoque' | 'algoritmo';
