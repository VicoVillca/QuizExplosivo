import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CodeInputComponent } from "../../components/code-input/code-input.component";
import { CodeOutputComponent } from "../../components/code-output/code-output.component";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";
import { JavaValidatorService } from "../../../core/services/java-validator.service";
import { labels } from "../../../core/constants/labels.constants";
import { messages } from "../../../core/constants/messages.constants";

@Component({
  selector: "app-organizer-page",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    CodeInputComponent,
    CodeOutputComponent,
    Toast,
  ],
  templateUrl: "./organizer-page.component.html",
  styleUrls: ["./organizer-page.component.scss"],
})
export class OrganizerPageComponent {
  result: any;
  isProcessing: boolean = false;
  inputCode: string = "";

  delimitadores = [
    { inicio: '"""', fin: '"""', tipo: "triple" },
    { inicio: "'", fin: "'", tipo: "char" },
    { inicio: '"', fin: '"', tipo: "string" },
    { inicio: "//", fin: "\n", tipo: "comentario_linea" },
    { inicio: "/*", fin: "*/", tipo: "comentario_bloque" },
  ];

  label = labels;
  message = messages;

  constructor(
    private messageService: MessageService,
    private javaValidatorService: JavaValidatorService
  ) {}

  onCodeChange(codigo: string) {
    this.inputCode = codigo;
    this.organizeCode();
  }

  limpiarPanel() {
    this.result = null;
  }

  organizeCode() {
    if (!this.javaValidatorService.isValidJavaCode(this.inputCode)) {
      this.viewMessage("error", "Error de Compilación", messages.invalidCode);
      this.result = null;
      return;
    }
    if (!this.inputCode.trim()) {
      this.result = null;
      this.viewMessage("error", "Código vacío", messages.emptyCode);
      return;
    }

    this.isProcessing = true;

    this.result = {
      organizedCode: this.limpiarCodigoManteniendoEspeciales(this.inputCode),
      stats: {
        processingTime: 450,
        linesReduced: 5,
      },
    };
    this.viewMessage("success", messages.codeOrganized, "");
  }

  limpiarCodigoManteniendoEspeciales(codigo: string): string {
    const elementos: Array<{ original: string; marcador: string }> = [];
    let contador = 0;

    // Patrón que captura: strings, chars, text blocks, comentarios
    const patron =
      /("""[\s\S]*?"""|"(\\.|[^"\\])*"|'(\\.|[^'\\])'|\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g;

    const codigoTemporal = codigo.replace(patron, (match) => {
      let tempId = `__TEMP_${contador++}__`;

      if (match.startsWith('"""')) {
        tempId = `"""${tempId}"""`;
      }
      if (match.startsWith('"')) {
        tempId = `"${tempId}"`;
      }
      if (match.startsWith("'")) {
        tempId = `'${tempId}'`;
      }
      if (match.startsWith("//")) {
        tempId = `//${tempId}`;
      }
      if (match.startsWith("/*")) {
        tempId = `/*${tempId}*/`;
      }

      elementos.push({ original: match, marcador: tempId });
      return tempId;
    });
    console.log(codigoTemporal);

    let resultado = this.ordenamosCodigoJava(codigoTemporal);

    for (let i = 0; i < elementos.length; i++) {
      resultado = resultado.replace(
        elementos[i].marcador,
        elementos[i].original
      );
    }
    return this.formatTab(resultado);
  }

  ordenamosCodigoJava(codigo: string) {
    let resultado = codigo;

    const operadores = [
      "+",
      "-",
      "*",
      "/",
      "%",
      "=",
      "<",
      ">",
      "!",
      "&",
      "|",
      "^",
      "~",
      "(",
      ")",
      "[",
      "]",
      "{",
      "}",
      "*",
      ".",
      ";",
    ];
    operadores.forEach((op) => {
      const regex = new RegExp(`\\s*\\${op}\\s*/g`, "g");
      resultado = resultado.replace(regex, op);
    });

    resultado = resultado.replace(/[ ]+/g, " ");
    resultado = resultado.replace(/[ ]*\.[ ]*/g, ".");
    resultado = resultado.replace(/{/g, "{\n");
    resultado = resultado.replace(/}/g, "\n}\n");
    resultado = resultado.replace(/[ ]*\([ ]*/g, "(");
    resultado = resultado.replace(/[ ]*\)/g, ") ");
    resultado = resultado.replace(/\)[ ]*\;/g, ");");
    resultado = resultado.replace(/\)\s*\n\s*\{/g, ") {");
    resultado = resultado.replace(/\s+\;\n/g, ";\n");
    resultado = resultado.replace(/[ ]+/g, " ");

    resultado = resultado.replace(/\}\s*\n\s*else/g, "} else");
    resultado = resultado.replace(/\}\s*else/g, "} else");
    resultado = resultado.replace(/else\s*\{/g, "else {");
    resultado = resultado.replace(/else\s+if\(/g, "else if (");

    //Borramos todos los espacios al inicio de la linea
    resultado = resultado.replace(/^[ \t]*/gm, "");

    //Borramos todos los espacios al inicio de la linea
    resultado = resultado.replace(/[ \t]*$/gm, "");

    //Borramos las lineas sin contenido
    resultado = resultado.replace(/^\s*$\n?/gm, "");

    return resultado;
  }

  formatTab(codigo: string) {
    let tab = 0;
    let codigo2 = "";
    let sw = 0;
    let vector: string[] = codigo.split("\n");
    for (let linea of vector) {
      if (linea.includes("}")) {
        if (tab == 2) {
          linea = linea + "\n";
        }
        tab--;
        sw = 0;
      }
      if (sw === 1) {
        if (!(linea.includes("case") || linea.includes("default"))) {
          codigo2 = codigo2 + this.getTabs(tab + 1) + linea + "\n";
        } else {
          codigo2 = codigo2 + this.getTabs(tab) + linea + "\n";
        }
      } else {
        codigo2 = codigo2 + this.getTabs(tab) + linea + "\n";
      }

      if (linea.includes("{")) {
        tab++;
        if (linea.includes("switch")) {
          sw = 1;
        }
      }
    }
    return codigo2;
  }

  getTabs(nroTabs: number) {
    let tabs = "";
    for (let i = 0; i < nroTabs; i++) {
      tabs = tabs + "\t";
    }
    return tabs;
  }

  compararSubstring(code: string, i: number) {
    for (const del of this.delimitadores) {
      if (code.substring(i, i + del.inicio.length) === del.inicio) {
        return del;
      }
    }
    return null;
  }

  generarTabs(n: number): string {
    return "\t".repeat(n);
  }

  viewMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
    });
  }
}
