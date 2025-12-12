import React from 'react';
import jsPDF from 'jspdf';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface EntrevistaReportGeneratorProps {
  entrevista: any;
}

export const EntrevistaReportGenerator: React.FC<EntrevistaReportGeneratorProps> = ({ entrevista }) => {
  
  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = 20;

    const checkPageBreak = (requiredSpace: number = 10) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    const splitText = (text: string, maxWidth: number): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    // ENCABEZADO
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME DE ENTREVISTA', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // INFORMACIÓN GENERAL
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Información General', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Estudiante
    if (entrevista.estudiante) {
      const nombreCompleto = `${entrevista.estudiante.nombre || ''} ${entrevista.estudiante.apellido_paterno || ''} ${entrevista.estudiante.apellido_materno || ''}`;
      doc.text(`Estudiante: ${nombreCompleto.trim()}`, margin, yPosition);
      yPosition += 6;
      if (entrevista.estudiante.rut) {
        doc.text(`RUT: ${entrevista.estudiante.rut}`, margin, yPosition);
        yPosition += 6;
      }
    }

    // Fecha
    const fechaFormateada = new Date(entrevista.fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Fecha: ${fechaFormateada}`, margin, yPosition);
    yPosition += 6;

    // Tutor
    if (entrevista.tutor || entrevista.nombre_Tutor) {
      doc.text(`Tutor: ${entrevista.tutor || entrevista.nombre_Tutor}`, margin, yPosition);
      yPosition += 6;
    }

    yPosition += 4;
    checkPageBreak(20);

    // TEMAS ABORDADOS
    if (entrevista.temas_abordados) {
      doc.setFont('helvetica', 'bold');
      doc.text('Temas Abordados:', margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      const temasLineas = splitText(entrevista.temas_abordados, maxWidth);
      temasLineas.forEach(linea => {
        checkPageBreak(6);
        doc.text(linea, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    checkPageBreak(20);

    // OBSERVACIONES
    if (entrevista.observaciones) {
      doc.setFont('helvetica', 'bold');
      doc.text('Observaciones:', margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      const observacionesLineas = splitText(entrevista.observaciones, maxWidth);
      observacionesLineas.forEach(linea => {
        checkPageBreak(6);
        doc.text(linea, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    checkPageBreak(20);

    // TEXTOS POR ETIQUETA (backend: entrevista.textos con etiqueta asociada)
    const textos = Array.isArray(entrevista.textos) ? entrevista.textos : [];

    if (textos.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Comentarios y Notas:', margin, yPosition);
      yPosition += 10;

      textos.forEach((texto: any, idx: number) => {
        checkPageBreak(32);

        const etiqueta = texto.etiqueta?.nombre_etiqueta || texto.nombre_etiqueta || 'Sin etiqueta';
        const fechaTxt = texto.fecha ? new Date(texto.fecha).toLocaleDateString('es-CL') : 'Sin fecha';
        const contexto = texto.contexto ? `Contexto: ${texto.contexto}` : '';

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        // Mostrar solo la etiqueta como título del bloque
        doc.text(etiqueta, margin, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${fechaTxt}`, margin, yPosition);
        yPosition += 6;

        const lineasContenido = splitText(texto.contenido || 'Sin contenido', maxWidth);
        lineasContenido.forEach(linea => {
          checkPageBreak(6);
          doc.text(linea, margin + 5, yPosition);
          yPosition += 6;
        });

        if (contexto) {
          const lineasCtx = splitText(contexto, maxWidth);
          lineasCtx.forEach(linea => {
            checkPageBreak(6);
            doc.text(linea, margin + 5, yPosition);
            yPosition += 6;
          });
        }

        yPosition += 6;
      });
    }

    // PIE DE PÁGINA
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text(`Generado el ${new Date().toLocaleDateString('es-CL')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    // Guardar
    const apellido = entrevista.estudiante?.apellido_paterno || '';
    const nombre = entrevista.estudiante?.nombre || 'Sin_Nombre';
    const fecha = new Date(entrevista.fecha).toLocaleDateString('es-CL').replace(/\//g, '-');
    const nombreArchivo = `Entrevista_${apellido}_${nombre}_${fecha}.pdf`;
    doc.save(nombreArchivo.replace(/\s+/g, '_'));
  };

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<PictureAsPdfIcon />}
      onClick={generarPDF}
      sx={{
        textTransform: 'none',
        fontWeight: 'bold',
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
        }
      }}
    >
      Generar PDF de Entrevista
    </Button>
  );
};
