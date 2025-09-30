import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity } from "lucide-react";

interface BudgetItem {
  lvl1: string;
  lvl2: string;
  project: string;
  plan: string;
  budget: number;
}

const Budgeting2569 = () => {
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [filteredData, setFilteredData] = useState<BudgetItem[]>([]);
  const [selectedLvl1, setSelectedLvl1] = useState<string>("all");
  const [selectedLvl2, setSelectedLvl2] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await fetch('/budgeting/2569/budgeting.json');
        const data = await response.json();
        setBudgetData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching budget data:', error);
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  useEffect(() => {
    let filtered = budgetData;

    if (selectedLvl1 && selectedLvl1 !== "all") {
      filtered = filtered.filter(item => item.lvl1 === selectedLvl1);
    }
    if (selectedLvl2 && selectedLvl2 !== "all") {
      filtered = filtered.filter(item => item.lvl2 === selectedLvl2);
    }
    if (selectedPlan && selectedPlan !== "all") {
      filtered = filtered.filter(item => item.plan === selectedPlan);
    }
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [budgetData, selectedLvl1, selectedLvl2, selectedPlan, searchTerm]);

  const getUniqueValues = (field: keyof BudgetItem) => {
    return Array.from(new Set(budgetData.map(item => String(item[field]))));
  };

  const getTotalBudget = () => {
    return budgetData.reduce((sum, item) => sum + item.budget, 0);
  };

  const getBudgetByLvl1 = () => {
    const grouped = budgetData.reduce((acc, item) => {
      acc[item.lvl1] = (acc[item.lvl1] || 0) + item.budget;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const getBudgetByPlan = () => {
    const grouped = budgetData.reduce((acc, item) => {
      acc[item.plan] = (acc[item.plan] || 0) + item.budget;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('th-TH').format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">งบประมาณรายจ่ายประจำปี 2569</h1>
        <p className="text-xl text-muted-foreground">
          องค์การบริหารส่วนจังหวัดลำพูน
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            งบประมาณรวม: {formatCurrency(getTotalBudget())}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            จำนวนโครงการ: {budgetData.length}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ประเภทงบ</label>
              <Select value={selectedLvl1} onValueChange={setSelectedLvl1}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทงบ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {getUniqueValues('lvl1').map((value) => (
                    <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ประเภทค่าใช้จ่าย</label>
              <Select value={selectedLvl2} onValueChange={setSelectedLvl2}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทค่าใช้จ่าย" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {getUniqueValues('lvl2').map((value) => (
                    <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">หมวดแผนงาน</label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดแผนงาน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {getUniqueValues('plan').map((value) => (
                    <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ค้นหา</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาโครงการหรือแผนงาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">งบประมาณรวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalBudget())}</div>
            <p className="text-xs text-muted-foreground">
              ปีงบประมาณ 2569
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนโครงการ</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetData.length}</div>
            <p className="text-xs text-muted-foreground">
              โครงการทั้งหมด
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ประเภทงบ</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueValues('lvl1').length}</div>
            <p className="text-xs text-muted-foreground">
              ประเภทงบประมาณ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หมวดแผนงาน</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueValues('plan').length}</div>
            <p className="text-xs text-muted-foreground">
              แผนงานทั้งหมด
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="charts">กราฟ</TabsTrigger>
          <TabsTrigger value="details">รายละเอียด</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Budget Distribution by Level 1 */}
          <Card>
            <CardHeader>
              <CardTitle>การกระจายงบประมาณตามประเภทงบ</CardTitle>
              <CardDescription>แสดงสัดส่วนงบประมาณในแต่ละประเภท</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getBudgetByLvl1().map((item) => {
                  const percentage = (item.value / getTotalBudget()) * 100;
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(item.value)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top 10 Plans by Budget */}
          <Card>
            <CardHeader>
              <CardTitle>แผนงานที่มีงบประมาณสูงสุด 10 อันดับ</CardTitle>
              <CardDescription>แสดงแผนงานที่ได้รับจัดสรรงบประมาณมากที่สุด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getBudgetByPlan().map((item, index) => {
                  const percentage = (item.value / getTotalBudget()) * 100;
                  return (
                    <div key={item.name} className="flex items-center space-x-4">
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.name}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(item.value)}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="w-24 h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget by Level 1 Chart */}
            <Card>
              <CardHeader>
                <CardTitle>งบประมาณตามประเภทงบ</CardTitle>
                <CardDescription>กราฟวงกลมแสดงสัดส่วนงบประมาณ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">กราฟวงกลมจะแสดงที่นี่</p>
                    <p className="text-xs text-muted-foreground">(ต้องติดตั้ง Chart.js หรือ Recharts)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget by Plan Chart */}
            <Card>
              <CardHeader>
                <CardTitle>งบประมาณตามแผนงาน</CardTitle>
                <CardDescription>กราฟแท่งแสดงงบประมาณในแต่ละแผนงาน</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">กราฟแท่งจะแสดงที่นี่</p>
                    <p className="text-xs text-muted-foreground">(ต้องติดตั้ง Chart.js หรือ Recharts)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดงบประมาณ</CardTitle>
              <CardDescription>
                แสดงรายละเอียดโครงการทั้งหมด {filteredData.length} รายการ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-sm">{item.project}</h4>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary">{item.lvl1}</Badge>
                          <Badge variant="outline">{item.lvl2}</Badge>
                          <Badge variant="default">{item.plan}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(item.budget)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatNumber(item.budget)} บาท
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Budgeting2569;
