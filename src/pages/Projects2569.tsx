import { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Building, DollarSign, Calendar, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

// Interface สำหรับข้อมูลงบประมาณ 2569
interface BudgetItem2569 {
  lvl1: string;
  lvl2: string;
  project: string;
  plan: string;
  budget: number;
}

const Projects2569 = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem2569[]>([]);
  const [filteredItems, setFilteredItems] = useState<BudgetItem2569[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLvl1, setSelectedLvl1] = useState<string>('all');
  const [selectedLvl2, setSelectedLvl2] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ดึงข้อมูลงบประมาณ 2569
  useEffect(() => {
    const fetchBudgetData2569 = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/budgeting/2569/budgeting.json');
        const data: BudgetItem2569[] = await response.json();
        setBudgetItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error fetching budget data 2569:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData2569();
  }, []);

  // สร้างรายการหมวดหมู่ lvl1, lvl2, และ plan สำหรับ filter
  const filterOptions = useMemo(() => {
    const lvl1Options = Array.from(new Set(budgetItems.map(item => item.lvl1))).sort();
    const lvl2Options = Array.from(new Set(budgetItems.map(item => item.lvl2))).sort();
    const planOptions = Array.from(new Set(budgetItems.map(item => item.plan))).sort();
    
    return {
      lvl1: lvl1Options,
      lvl2: lvl2Options,
      plan: planOptions
    };
  }, [budgetItems]);

  // Filter ข้อมูลตามเงื่อนไข
  useEffect(() => {
    let filtered = budgetItems;

    // Filter ตาม search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lvl1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lvl2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter ตาม lvl1
    if (selectedLvl1 !== 'all') {
      filtered = filtered.filter(item => item.lvl1 === selectedLvl1);
    }

    // Filter ตาม lvl2
    if (selectedLvl2 !== 'all') {
      filtered = filtered.filter(item => item.lvl2 === selectedLvl2);
    }

    // Filter ตาม plan
    if (selectedPlan !== 'all') {
      filtered = filtered.filter(item => item.plan === selectedPlan);
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [budgetItems, searchTerm, selectedLvl1, selectedLvl2, selectedPlan]);

  // คำนวณสถิติ
  const stats = useMemo(() => {
    const totalBudget = filteredItems.reduce((sum, item) => sum + item.budget, 0);
    const totalProjects = filteredItems.length;
    const avgBudget = totalProjects > 0 ? totalBudget / totalProjects : 0;

    return {
      totalBudget,
      totalProjects,
      avgBudget
    };
  }, [filteredItems]);

  // คำนวณ pagination data
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [filteredItems, currentPage, itemsPerPage]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLvl1('all');
    setSelectedLvl2('all');
    setSelectedPlan('all');
  };

  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (paginationData.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <PageContainer
        title="รายการโครงการงบประมาณ 2569"
        description="แสดงรายการโครงการงบประมาณประจำปี 2569 ขององค์การบริหารส่วนจังหวัดลำพูน"
        date="2569"
      >
        {/* สถิติสรุป */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">จำนวนโครงการ</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{formatNumber(stats.totalProjects)}</div>
              <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">งบประมาณรวม</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold break-all">{formatCurrency(stats.totalBudget)}</div>
              <p className="text-xs text-muted-foreground">บาท</p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">งบประมาณเฉลี่ย</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold break-all">{formatCurrency(stats.avgBudget)}</div>
              <p className="text-xs text-muted-foreground">บาทต่อโครงการ</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              ตัวกรองข้อมูล
            </CardTitle>
            <CardDescription>
              กรองข้อมูลโครงการตามหมวดหมู่และคำค้นหา
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search - Full width on mobile */}
              <div className="space-y-2">
                <label className="text-sm font-medium">ค้นหา</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาโครงการ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Lvl1 Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">หมวดงบประมาณหลัก</label>
                  <Select value={selectedLvl1} onValueChange={setSelectedLvl1}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดงบประมาณ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {filterOptions.lvl1.map((lvl1) => (
                        <SelectItem key={lvl1} value={lvl1}>
                          {lvl1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Lvl2 Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">หมวดงบประมาณย่อย</label>
                  <Select value={selectedLvl2} onValueChange={setSelectedLvl2}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดย่อย" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {filterOptions.lvl2.map((lvl2) => (
                        <SelectItem key={lvl2} value={lvl2}>
                          {lvl2}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Plan Filter */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label className="text-sm font-medium">แผนงาน</label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกแผนงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {filterOptions.plan.map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">แสดงต่อหน้า:</label>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
                  รีเซ็ตตัวกรอง
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* รายการโครงการ */}
        <Card>
          <CardHeader>
            <CardTitle>
              รายการโครงการ ({formatNumber(filteredItems.length)} รายการ)
              {paginationData.totalPages > 1 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  หน้า {currentPage} จาก {paginationData.totalPages}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              แสดงรายการโครงการที่กรองแล้ว
              {paginationData.totalPages > 1 && (
                <span className="block">
                  แสดงรายการที่ {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, filteredItems.length)} จาก {filteredItems.length} รายการ
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginationData.currentItems.map((item, index) => (
                <Card key={index} className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {/* Project Title */}
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg leading-tight mb-2 break-words">
                        {item.project}
                      </h3>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.lvl1}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.lvl2}
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        {item.plan}
                      </Badge>
                    </div>

                    {/* Budget - Mobile optimized */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-muted-foreground">งบประมาณ</div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-primary">
                          {formatCurrency(item.budget)}
                        </div>
                        <div className="text-xs text-muted-foreground">บาท</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">ไม่พบข้อมูล</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  ไม่พบโครงการที่ตรงกับเงื่อนไขการกรอง
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {paginationData.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  แสดง {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, filteredItems.length)} จาก {filteredItems.length} รายการ
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={!paginationData.hasPrevPage}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">ก่อนหน้า</span>
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
                      let pageNum;
                      if (paginationData.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= paginationData.totalPages - 2) {
                        pageNum = paginationData.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={!paginationData.hasNextPage}
                    className="flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">ถัดไป</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default Projects2569;
