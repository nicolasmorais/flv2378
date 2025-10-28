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
          width: isMobile ? 4 : 3,
          height: isMobile ? 160 : 120,
          displayValue: true,
          fontOptions: "bold",
          fontSize: isMobile ? 32 : 24,
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
