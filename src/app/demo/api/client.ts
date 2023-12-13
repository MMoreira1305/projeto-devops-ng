interface Sexos {
    label: string;
    value: string;
}
export interface Client {
    key?: string;
    id?: string;
    nome?: string;
    rua?: string;
    bairro?: string;
    numero?: string;
    cidade?: number;
    cep?: string;
    estado?: string;
    cpf?: number;
    sexo?: Sexos;
}