export const JAVA_EXAMPLE_COMPLEJO = `// EJEMPLO COMPLEJO - Código desordenado para organizar

import java.util.*;

import java.io.*;



public class EstudianteDesordenado {


// Campos mezclados
private int edad;
public String nombre;  
private String apellido;

// Constructor
public EstudianteDesordenado(String nombre, String apellido, int edad) {
this.nombre = nombre;
this.apellido = apellido;
    this.edad = edad;
    }

// Método público
public void imprimirDatos() {
System.out.println("Nombre: " + nombre);
System.out.println("Apellido: " + apellido);
        System.out.println("Edad: " + edad);
}


// Getter
public int getEdad() {
return edad;
}

// Setter
public void setEdad(int nuevaEdad) {
this.edad = nuevaEdad;
        }


private boolean esMayorDeEdad() {
    return edad >= 18;
}




// Método main
public static void main(String[] args) {
    
EstudianteDesordenado estudiante = new EstudianteDesordenado("Juan", "Perez", 20);
    
estudiante.imprimirDatos();
    
    
if (estudiante.esMayorDeEdad()) {
System.out.println("Es mayor de edad");
} else {
    System.out.println("Es menor de edad");
}
    
}
    
}`;


export const JAVA_EXAMPLE_EXTREMO = `
/// TODO DESFORMATEADO
  import java.util.*;
import   java.io.*   ;
  
public   class   CaosCompleto   {
  
private   final   int   MAX   =   100   ;
  
public   static   void   main   (   String   [   ]   args   )   {
CaosCompleto   c   =   new   CaosCompleto   (   )   ;
c   .   ejecutar   (   )   ;
}
  
public   void   ejecutar   (   )   {
for   (   int   i   =   0   ;   i   <   MAX   ;   i   ++   )   {
if   (   i   %   2   ==   0   )   {
System   .   out   .   println   (   "Par: "   +   i   )   ;
}   else   {
System   .   out   .   println   (   "Impar: "   +   i   )   ;
}
}
}
  
public   void   metodoConEspaciosRaros   (   )   {
int   x   =   5   ;
int   y   =   10   ;
  
if   (   x   >   y   )   {
System   .   out   .   println   (   "x mayor"   )   ;
}   else   if   (   x   <   y   )   {
System   .   out   .   println   (   "y mayor"   )   ;
}   else   {
System   .   out   .   println   (   "iguales"   )   ;
}
  
for   (   int   i   =   0   ;   i   <   5   ;   i   ++   )   {
switch   (   i   )   {
case   0   :
System   .   out   .   println   (   "cero"   )   ;
break   ;
case   1   :
System   .   out   .   println   (   "uno"   )   ;
break   ;
default   :
System   .   out   .   println   (   "otro"   )   ;
}
}
}
  
private   void   metodoMalIndentado   (   )   {
try   {
FileInputStream   fis   =   new   FileInputStream   (   "archivo.txt"   )   ;
int   data   =   fis   .   read   (   )   ;
while   (   data   !=   -   1   )   {
System   .   out   .   print   (   (   char   )   data   )   ;
data   =   fis   .   read   (   )   ;
}
fis   .   close   (   )   ;
}   catch   (   IOException   e   )   {
e   .   printStackTrace   (   )   ;
}   finally   {
System   .   out   .   println   (   "Fin lectura"   )   ;
}
}
  
// LÍNEAS MUY LARGAS SIN FORMATO
public String metodoLineaLarga() { String texto = "Esta es una línea extremadamente larga que debería ser dividida en múltiples líneas para mejorar la legibilidad pero está escrita toda en una sola línea sin ningún tipo de formato o consideración por los límites de longitud recomendados"; return texto; }
  
// TABS Y ESPACIOS MEZCLADOS
	public void conTabs() {
		System.out.println("línea con tab");
    System.out.println("línea con 4 espacios"); // Mezclado
		System.out.println("otra con tab");
			System.out.println("doble tab"); // Indentación inconsistente
	}
  
    // LLAVES EN LUGARES RAROS
    public void llavesLocas() 
    {
        if (true) 
        {
            System.out.println("verdad");
        } 
        else 
        {
            System.out.println("falso");
        }
    }
  
// COMENTARIO CON FORMATO EXTRAÑO
/* Este
     comentario
        tiene
           indentación
              muy
                 rara */
  
// OPERADORES SIN ESPACIOS
public void sinEspacios(){
int a=5+3*2;
String b="texto"+a;
if(a>10){System.out.println(b);}else{System.out.println("menor");}
}
  
}
`;