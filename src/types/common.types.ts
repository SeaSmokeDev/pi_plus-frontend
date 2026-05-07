export type ID = number;

export type ApiDate = string; // normalmente vendrá como string desde JSON/API

export type UserRole =
  | "trabajador_almacen"
  | "tecnico"
  | "logistica"
  | "administrador";