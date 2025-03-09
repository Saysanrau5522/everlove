
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
    <Card className="p-8 md:p-10 border-0 shadow-none overflow-hidden paper-texture relative">
      {/* Decorative elements for authenticity */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-100/50 via-amber-200/30 to-amber-100/50"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-100/50 via-amber-200/30 to-amber-100/50"></div>
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-100/50 via-amber-200/30 to-amber-100/50"></div>
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-100/50 via-amber-200/30 to-amber-100/50"></div>
      
      {/* Aged paper texture and fold marks */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute left-0 right-0 top-1/3 h-px bg-amber-900/20"></div>
        <div className="absolute left-0 right-0 top-2/3 h-px bg-amber-900/20"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-amber-900/20"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col font-serif leading-relaxed tracking-wide text-gray-800">
          <div className="text-right mb-8 text-gray-600 italic text-sm">
            {format(date, 'MMMM d, yyyy')}
          </div>
          
          <div className="mb-6">
            <p className="text-lg">Dearest {recipient},</p>
          </div>
          
          <div className="flex-1 mb-8 text-base">
            {children}
          </div>
          
          <div className="flex flex-col items-end space-y-3 mt-4">
            <p className="text-base italic">With deepest affection,</p>
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
    </Card>
  );
};

export default LetterTemplate;
