export type SourceConnectionType =
  | "postgresql"
  | "mysql"
  | "csv"
  | "rest-api";

export interface SourceNodeConfig {
  connectionType: SourceConnectionType;

  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;

  query?: string;

  filePath?: string;

  url?: string;
  method?: "GET" | "POST";
}

export type TransformOperation =
  | "filter"
  | "map"
  | "aggregate"
  | "sort";

export interface TransformNodeConfig {
  operation: TransformOperation;

  expression?: string;
  groupBy?: string[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export type DestinationType =
  | "postgresql"
  | "mysql"
  | "csv"
  | "rest-api";

export interface DestinationNodeConfig {
  destinationType: DestinationType;

  host?: string;
  port?: number;
  database?: string;
  table?: string;

  filePath?: string;

  url?: string;
  method?: "POST" | "PUT" | "PATCH";
}