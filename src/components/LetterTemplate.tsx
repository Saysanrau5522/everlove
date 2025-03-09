
import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface LetterTemplateProps {
  children: ReactNode;
  recipient: string;
  sender?: string;
  date?: Date;
}

const LetterTemplate = ({
  children,
  recipient,
  sender = "Me",
  date = new Date(),
}: LetterTemplateProps) => {
  return (
    <Card className="p-8 md:p-10 max-w-3xl mx-auto border-0 shadow-xl rounded-sm overflow-hidden paper-texture relative">
      {/* Old paper texture background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/80"></div>
      
      {/* Aged paper effects */}
      <div className="absolute inset-0 bg-[url('data:image/png;base64,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')] bg-repeat opacity-5"></div>
      
      {/* Torn edges and fold marks */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute left-0 right-0 top-1/3 h-px bg-amber-900/30"></div>
        <div className="absolute left-0 right-0 top-2/3 h-px bg-amber-900/30"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-amber-900/30"></div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-amber-100/90 transform rotate-45 translate-x-[-50%] translate-y-[-50%]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 bg-amber-100/90 transform rotate-45 translate-x-[50%] translate-y-[-50%]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-amber-100/90 transform rotate-45 translate-x-[-50%] translate-y-[50%]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-100/90 transform rotate-45 translate-x-[50%] translate-y-[50%]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col font-serif leading-relaxed tracking-wide text-gray-800">
          <div className="text-right mb-8 text-gray-600 italic text-sm">
            {format(date, 'MMMM d, yyyy')}
          </div>
          
          <div className="mb-6">
            <p className="text-lg">Dearest {recipient},</p>
          </div>
          
          <div className="flex-1 mb-8 space-y-4 text-base min-h-[200px]">
            {children}
          </div>
          
          <div className="flex flex-col items-end space-y-3 mt-6">
            <p className="text-base italic">With warmest affection,</p>
            <p className="font-medium text-lg">{sender}</p>
          </div>
        </div>
      </div>
      
      {/* Decorative wax seal */}
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rotate-12">
        <div className="relative w-20 h-20 rounded-full bg-love-deep/80 flex items-center justify-center shadow-lg">
          <div className="text-white text-xs font-serif tracking-wide opacity-90 rotate-[-12deg]">Sealed with love</div>
          <div className="absolute inset-3 rounded-full border-2 border-amber-200/60"></div>
          <div className="absolute inset-0 rounded-full shadow-inner"></div>
        </div>
      </div>
      
      {/* Subtle coffee stain */}
      <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-amber-700/5 blur-md"></div>
      
      {/* Handwritten annotations */}
      <div className="absolute top-8 right-10 text-xs italic text-amber-800/30 rotate-[-5deg] font-handwriting">Remember this moment</div>
    </Card>
  );
};

export default LetterTemplate;
