
'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import type { Note } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BarcodeGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: ({ plu: string } & Note) | null;
}

const Barcode = ({ value }: { value: string }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 100,
          displayValue: true,
          fontOptions: "bold",
          fontSize: 18,
        });
      } catch (e) {
        console.error("Error generating barcode:", e);
        // Fallback or error display could be implemented here
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
        }
      }
    }
  }, [value]);

  return <svg ref={svgRef} />;
};


export default function BarcodeGeneratorDialog({ isOpen, onOpenChange, product }: BarcodeGeneratorDialogProps) {
  
  if (!product) {
    return null;
  }

  const handlePrint = () => {
    const svgElement = document.getElementById('barcode-svg-container');
    if (svgElement) {
        const printWindow = window.open('', '', 'height=400,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Imprimir Código de Barras</title>');
            printWindow.document.write('<style>@media print { body { margin: 0; } @page { size: auto; margin: 10mm; } }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(svgElement.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>
            Código de Barras para o PLU: {product.plu}
          </DialogDescription>
        </DialogHeader>
        <div id="barcode-svg-container" className="flex justify-center items-center py-4">
          <Barcode value={product.plu} />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button type="button" onClick={handlePrint}>Imprimir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
