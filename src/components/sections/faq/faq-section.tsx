"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQData {
  headline: string;
  subtitle: string;
  questions: FAQ[];
}

interface FAQSectionProps {
  faqData: FAQData;
}

export default function FAQSection({ faqData }: FAQSectionProps) {
  return (
    <section className="w-full py-20 bg-background" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Badge>
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight">
            {faqData.headline}
          </h2>
          <p 
            className="text-xl text-muted-foreground"
            dangerouslySetInnerHTML={{ 
              __html: faqData.subtitle.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>') 
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.questions.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id} 
                className="border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="text-lg font-semibold pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-2 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We&apos;re here to help.
          </p>
        </div>
      </div>
    </section>
  );
}