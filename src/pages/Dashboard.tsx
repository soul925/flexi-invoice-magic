
import { useState } from 'react';
import Layout from '@/components/Layout';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart, 
  FileText, 
  Settings, 
  Search, 
  Filter, 
  ChevronDown,
  DownloadCloud,
  FileCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample data for processed invoices
  const invoiceData = [
    {
      id: 'INV-001',
      vendor: 'Acme Inc.',
      date: '2023-10-15',
      amount: '$1,250.00',
      status: 'completed',
      type: 'retail'
    },
    {
      id: 'INV-002',
      vendor: 'Tech Solutions',
      date: '2023-10-14',
      amount: '$3,720.50',
      status: 'completed',
      type: 'technology'
    },
    {
      id: 'INV-003',
      vendor: 'MediCare Services',
      date: '2023-10-13',
      amount: '$850.00',
      status: 'review',
      type: 'healthcare'
    },
    {
      id: 'INV-004',
      vendor: 'Global Logistics',
      date: '2023-10-12',
      amount: '$4,150.25',
      status: 'completed',
      type: 'logistics'
    },
    {
      id: 'INV-005',
      vendor: 'City Hospital',
      date: '2023-10-11',
      amount: '$2,350.75',
      status: 'review',
      type: 'healthcare'
    },
    {
      id: 'INV-006',
      vendor: 'Retail Supplies Co.',
      date: '2023-10-10',
      amount: '$975.30',
      status: 'error',
      type: 'retail'
    }
  ];

  const filteredInvoices = activeFilter === 'all' 
    ? invoiceData 
    : invoiceData.filter(invoice => invoice.status === activeFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'review':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'review':
        return 'Needs Review';
      case 'error':
        return 'Processing Error';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your invoice processing
            </p>
          </div>
          <Button asChild className="rounded-lg focus-ring">
            <Link to="/process">Process New Invoice</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard className="bg-green-50 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-800">Processed</div>
                <div className="text-2xl font-bold text-green-900">24</div>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-4 text-xs text-green-800">
              <span className="font-medium">+12%</span> from last month
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-amber-50 border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-amber-800">Pending Review</div>
                <div className="text-2xl font-bold text-amber-900">7</div>
              </div>
              <div className="bg-amber-200 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <div className="mt-4 text-xs text-amber-800">
              <span className="font-medium">-3%</span> from last month
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-blue-50 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-800">Total Value</div>
                <div className="text-2xl font-bold text-blue-900">$28,450</div>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-800">
              <span className="font-medium">+18%</span> from last month
            </div>
          </AnimatedCard>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-card rounded-xl shadow-sm p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-auto min-w-[220px]"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1 text-sm">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all" onClick={() => setActiveFilter('all')}>All</TabsTrigger>
              <TabsTrigger value="completed" onClick={() => setActiveFilter('completed')}>Completed</TabsTrigger>
              <TabsTrigger value="review" onClick={() => setActiveFilter('review')}>Review</TabsTrigger>
              <TabsTrigger value="error" onClick={() => setActiveFilter('error')}>Error</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {invoice.vendor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(invoice.status)}
                            <span>{getStatusText(invoice.status)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Download">
                            <DownloadCloud className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Settings">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            {/* The content for the other tabs would be identical but with filtered data */}
            <TabsContent value="completed" className="space-y-4">
              {/* Same table with filtered data */}
            </TabsContent>
            <TabsContent value="review" className="space-y-4">
              {/* Same table with filtered data */}
            </TabsContent>
            <TabsContent value="error" className="space-y-4">
              {/* Same table with filtered data */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
