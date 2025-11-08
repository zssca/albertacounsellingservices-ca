import Link from 'next/link';
import { ArrowLeft, Home, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { businessInfo } from '@/data/business';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <CardTitle className="text-3xl mb-4">Page Not Found</CardTitle>
            <p className="text-xl text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved or doesn&apos;t exist.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/services" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  View Services
                </Link>
              </Button>
            </div>
            
            <div className="pt-6 border-t">
              <p className="text-muted-foreground mb-4">
                Need immediate support? Contact us directly:
              </p>
              <Button variant="outline" asChild>
                <Link href={`tel:${businessInfo.contact.phone}`} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {businessInfo.contact.phone}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}