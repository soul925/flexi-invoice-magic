
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Upload, 
  ImageIcon, 
  Download, 
  CheckCircle, 
  Search, 
  FileOutput,
  Lock,
  Zap,
  CloudUpload
} from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent z-0" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24 md:pt-32 md:pb-40 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block mb-6">
              <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                AI-Powered Invoice Processing
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance max-w-4xl animate-fade-in">
              Transform handwritten invoices into structured data instantly
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 animate-fade-in animate-slide-up" style={{ animationDelay: '100ms' }}>
              Upload, extract, validate, and export invoice data with unmatched accuracy using our advanced OCR and AI processing system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button asChild size="lg" className="rounded-full px-8 focus-ring">
                <Link to="/process">Process Invoice Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 focus-ring">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Feature Overview */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Advanced Processing Pipeline</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our system handles everything from ingestion to export with precision and intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedCard delay={100} animation="slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-lg mb-5">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Versatile Ingestion</h3>
              <p className="text-muted-foreground">
                Upload PDFs, images, or receive invoices directly via email with our flexible ingestion system.
              </p>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={200} animation="slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-lg mb-5">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Image Enhancement</h3>
              <p className="text-muted-foreground">
                Automatic noise reduction, contrast enhancement, and skew correction for optimal OCR results.
              </p>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={300} animation="slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-lg mb-5">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Intelligent Extraction</h3>
              <p className="text-muted-foreground">
                Advanced OCR algorithms designed for handwritten text with layout analysis and field detection.
              </p>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={400} animation="slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-lg mb-5">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Smart Validation</h3>
              <p className="text-muted-foreground">
                Validate extracted data, detect anomalies, and flag missing fields in real-time.
              </p>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={500} animation="slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-lg mb-5">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Manual Review</h3>
              <p className="text-muted-foreground">
                Intuitive interface for reviewing and correcting extracted data before finalizing.
              </p>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={600} animation="slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-lg mb-5">
                <FileOutput className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Flexible Outputs</h3>
              <p className="text-muted-foreground">
                Generate structured JSON data, professional PDF documents, and QR codes for tracking.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple, three-step process to transform your invoices into structured data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-6">
                <span className="text-xl font-semibold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Upload Invoice</h3>
              <p className="text-muted-foreground">
                Upload your invoice as a PDF or image. We support various formats including JPEG, PNG, and PDF.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-6">
                <span className="text-xl font-semibold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Review Extraction</h3>
              <p className="text-muted-foreground">
                Our AI extracts all relevant data. Verify and make any necessary corrections in our intuitive interface.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-6">
                <span className="text-xl font-semibold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Export & Save</h3>
              <p className="text-muted-foreground">
                Download your structured data in JSON format or as a beautifully formatted PDF with QR tracking.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button asChild size="lg" className="rounded-full px-8 focus-ring">
              <Link to="/process">Try It Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Designed for accuracy and efficiency</h2>
            <p className="text-muted-foreground mb-8">
              Our system is built to handle the complexities of handwritten invoices with unmatched precision. Save time, reduce errors, and gain valuable insights from your invoice data.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-2 rounded">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Data Security & Integrity</h3>
                  <p className="text-muted-foreground text-sm">
                    Your data remains private and secure. We maintain input-output integrity throughout the process.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-2 rounded">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Blazing Fast Processing</h3>
                  <p className="text-muted-foreground text-sm">
                    Process invoices in seconds, not minutes. Our optimized pipeline delivers results quickly.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-2 rounded">
                  <CloudUpload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Industry-Specific Adaptations</h3>
                  <p className="text-muted-foreground text-sm">
                    Customized solutions for healthcare, retail, and more, with field recognition specific to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl transform -rotate-3"></div>
            <div className="relative glass-panel rounded-2xl p-8 shadow-sm transform rotate-1">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Invoice #</div>
                    <div className="font-medium">INV-2023-0158</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">Oct 15, 2023</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Vendor</div>
                  <div className="font-medium">Acme Corporation</div>
                  <div className="text-sm text-muted-foreground">123 Business St, Suite 100</div>
                  <div className="text-sm text-muted-foreground">San Francisco, CA 94107</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Items</div>
                  <div className="bg-muted/40 rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Product A</div>
                      <div className="font-medium">$1,200.00</div>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Product B</div>
                      <div className="font-medium">$850.00</div>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Services</div>
                      <div className="font-medium">$2,000.00</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between border-t pt-4">
                  <div className="font-medium">Total</div>
                  <div className="font-bold">$4,050.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-primary/5 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your invoice processing?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of businesses that have simplified their invoice management with our AI-powered system.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 focus-ring">
            <Link to="/process">Process Your First Invoice</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
