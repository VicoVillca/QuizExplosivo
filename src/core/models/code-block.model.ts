// Modelo para bloques de código detectados
export interface lineCode{
  codeInitial: string;
  comentary: string;
  codeFinal: string;
}
export interface CodeBlock {
  type: CodeBlockType;
  name: string;
  content: string;
  lineNumber: number;
  lineCount: number;
  accessModifier?: AccessModifier;
  parameters?: string[];
  returnType?: string;
  isStatic?: boolean;
  isFinal?: boolean;
}

// Tipos de bloques de código
export type CodeBlockType = 
  | 'package'
  | 'import'
  | 'class'
  | 'interface'
  | 'enum'
  | 'annotation'
  | 'method'
  | 'constructor'
  | 'field'
  | 'comment'
  | 'unknown';

// Modificadores de acceso
export type AccessModifier = 'public' | 'private' | 'protected' | 'package';

// Opciones de organización
export interface OrganizationOptions {
  // Ordenamiento
  sortOrder: 'type' | 'alphabetical' | 'access' | 'custom';
  
  // Formateo
  removeEmptyLines: boolean;
  formatSpacing: boolean;
  spaceBeforeBraces: boolean;
  alignAssignments: boolean;
  
  // Agrupación
  groupImports: boolean;
  groupFields: boolean;
  groupMethods: boolean;
  
  // Orden específico
  importOrder: 'alphabetical' | 'length' | 'package';
  methodOrder: 'alphabetical' | 'access' | 'type';
  
  // Indentación
  indentSize: 2 | 4 | 8;
  useTabs: boolean;
  
  // Limpieza
  removeComments: boolean;
  removeUnusedImports: boolean;
  removeTrailingSpaces: boolean;
  
  // Otros
  maxLineLength: number;
  sortImportsAlphabetically: boolean;
}

// Resultado de la organización
export interface OrganizedResult {
  // Código
  originalCode: string;
  organizedCode: string;
  
  // Bloques detectados
  blocks: CodeBlock[];
  blocksByType: Record<CodeBlockType, CodeBlock[]>;
  
  // Estadísticas
  stats: {
    processingTime: number;
    originalLines: number;
    organizedLines: number;
    linesReduced: number;
    blocksCount: number;
    importsCount: number;
    methodsCount: number;
    fieldsCount: number;
  };
  
  // Análisis
  analysis: {
    codeSmells: CodeSmell[];
    suggestions: Suggestion[];
    complexity: number;
  };
}

// Code smells detectados
export interface CodeSmell {
  type: CodeSmellType;
  description: string;
  line: number;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export type CodeSmellType = 
  | 'long-method'
  | 'large-class'
  | 'duplicate-code'
  | 'too-many-parameters'
  | 'magic-number'
  | 'unused-import'
  | 'unused-variable'
  | 'complex-condition'
  | 'nested-loop'
  | 'poor-naming';

// Sugerencias de mejora
export interface Suggestion {
  type: SuggestionType;
  description: string;
  codeExample: string;
  priority: 'low' | 'medium' | 'high';
}

export type SuggestionType = 
  | 'extract-method'
  | 'rename-variable'
  | 'add-comments'
  | 'use-constants'
  | 'simplify-condition'
  | 'remove-duplication'
  | 'improve-structure';

// Historial de operaciones
export interface OrganizationHistory {
  id: string;
  timestamp: Date;
  originalCode: string;
  organizedCode: string;
  options: OrganizationOptions;
  stats: OrganizedResult['stats'];
}

// Configuración de usuario
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultOptions: OrganizationOptions;
  autoCopyToClipboard: boolean;
  autoFormatOnPaste: boolean;
  showStatistics: boolean;
  showSuggestions: boolean;
}

// Constantes útiles
export const DEFAULT_OPTIONS: OrganizationOptions = {
  sortOrder: 'type',
  removeEmptyLines: true,
  formatSpacing: true,
  spaceBeforeBraces: true,
  alignAssignments: false,
  groupImports: true,
  groupFields: true,
  groupMethods: true,
  importOrder: 'alphabetical',
  methodOrder: 'access',
  indentSize: 2,
  useTabs: false,
  removeComments: false,
  removeUnusedImports: true,
  removeTrailingSpaces: true,
  maxLineLength: 120,
  sortImportsAlphabetically: true
};

// Orden por defecto de tipos de código
export const DEFAULT_TYPE_ORDER: CodeBlockType[] = [
  'package',
  'import',
  'class',
  'interface',
  'enum',
  'annotation',
  'field',
  'constructor',
  'method',
  'comment'
];

// Prioridad de modificadores de acceso para ordenamiento
export const ACCESS_MODIFIER_ORDER: Record<AccessModifier, number> = {
  'public': 1,
  'protected': 2,
  'package': 3,
  'private': 4
};

// Patrones regex para detección
export const REGEX_PATTERNS = {
  PACKAGE: /^\s*package\s+([\w.]+);/,
  IMPORT: /^\s*import\s+(?:static\s+)?([\w.*]+);/,
  CLASS: /^\s*(?:public|private|protected)?\s*(?:abstract\s+)?(?:final\s+)?class\s+(\w+)/,
  INTERFACE: /^\s*(?:public|private|protected)?\s*interface\s+(\w+)/,
  ENUM: /^\s*(?:public|private|protected)?\s*enum\s+(\w+)/,
  METHOD: /^\s*(?:public|private|protected|static|final|abstract|synchronized\s+)*\s*([\w<>\[\]]+)\s+(\w+)\s*\([^)]*\)/,
  FIELD: /^\s*(?:public|private|protected|static|final)\s+([\w<>\[\]]+)\s+(\w+)\s*(?:=.*)?;/,
  CONSTRUCTOR: /^\s*(?:public|private|protected)\s+(\w+)\s*\([^)]*\)/,
  COMMENT_SINGLE: /^\s*\/\/.*/,
  COMMENT_MULTI_START: /^\s*\/\*/,
  COMMENT_MULTI_END: /\*\//,
  ANNOTATION: /^\s*@\w+/
};