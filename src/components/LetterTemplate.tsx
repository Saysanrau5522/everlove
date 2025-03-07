
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
    <Card className="p-8 md:p-10 border border-amber-100 bg-parchment-light shadow-letter overflow-hidden animate-letter-unfold">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-50/30 to-transparent opacity-40" />
      
      <div className="relative z-10">
        <div className="flex flex-col font-serif leading-relaxed tracking-wide text-gray-800">
          <div className="text-right mb-6 text-gray-500 italic text-sm">
            {format(date, 'MMMM d, yyyy')}
          </div>
          
          <div className="mb-6">
            <p className="text-lg">Dear {recipient},</p>
          </div>
          
          <div className="flex-1 mb-8">
            {children}
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <p>With love,</p>
            <p className="font-medium">{sender}</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-full h-24 bg-gradient-to-t from-amber-50/30 to-transparent opacity-40" />
      
      {/* Decorative wax seal */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rotate-12 opacity-10">
        <div className="relative w-16 h-16 rounded-full bg-love-deep/80">
          <div className="absolute inset-2 rounded-full border-2 border-amber-200/60" />
        </div>
      </div>
    </Card>
  );
};

export default LetterTemplate;
