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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface BarcodeGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: ({ plu: string } & Note) | null;
}

const Barcode = ({ value, isMobile }: { value: string, isMobile: boolean }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          lineColor: "#000",
          width: isMobile ? 3 : 2,
          height: isMobile ? 120 : 100,
          displayValue: true,
          fontOptions: "bold",
          fontSize: isMobile ? 24 : 18,
        });
      } catch (e) {
        console.error("Error generating barcode:", e);
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
        }
      }
    }
  }, [value, isMobile]);

  return <svg ref={svgRef} />;
};


export default function BarcodeGeneratorDialog({ isOpen, onOpenChange, product }: BarcodeGeneratorDialogProps) {
  const isMobile = useIsMobile();
  
  if (!product) {
    return null;
  }

  const handlePrint = () => {
    const svgElement = document.getElementById('barcode-svg-container');
    if (svgElement) {
        const printWindow = window.open('', '', 'height=400,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Imprimir Código de Barras</title>');
            printWindow.document.write('<style>@media print { body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100%; } @page { size: auto; margin: 10mm; } svg { width: 90%; height: auto; } }</style>');
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
      <DialogContent className={cn("sm:max-w-md", isMobile && "w-[90vw] max-w-[90vw]")}>
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>
            Código de Barras para o PLU: {product.plu}
          </DialogDescription>
        </DialogHeader>
        <div id="barcode-svg-container" className="flex justify-center items-center py-4 overflow-x-auto">
          <Barcode value={product.plu} isMobile={isMobile} />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
