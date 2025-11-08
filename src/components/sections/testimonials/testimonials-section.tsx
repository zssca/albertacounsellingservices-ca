import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface Testimonial {
  id: string;
  name: string;
  text: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 bg-background custom-component no-effects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2 no-effects">
            Client Stories
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Real experiences from individuals and families who have transformed their lives through counselling
          </p>
        </div>

        <Carousel opts={{ align: 'start', loop: false }} className="w-full">
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                <Card className="border shadow-none h-full">
                  <CardContent className="p-8 md:p-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Quote className="h-10 w-10 text-primary" />
                    </div>
                    <blockquote className="text-base md:text-lg leading-relaxed mb-6 text-center">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                    <div className="mt-auto text-center">
                      <cite className="text-base font-semibold not-italic">— {t.name}</cite>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="shadow-none" />
          <CarouselNext className="shadow-none" />
        </Carousel>
      </div>
    </section>
  );
}