import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import BudgetAllocationChart from '@/components/dashboard/BudgetAllocationChart';
import BudgetProgressChart from '@/components/dashboard/BudgetProgressChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectsTable from '@/components/projects/ProjectsTable';
import { ArrowUpRight, ArrowDownRight, Layers, Building, Landmark, ArrowRight, Download, FileText } from 'lucide-react';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';

// Interface สำหรับข้อมูลงบประมาณ 2569
interface BudgetItem2569 {
  lvl1: string;
  lvl2: string;
  project: string;
  plan: string;
  budget: number;
}

interface BudgetSummary2569 {
  total: {
    approved: number;
    disbursed: number;
    committed: number;
    remaining: number;
  };
  by_lvl1: {
    [key: string]: {
      approved: number;
      project_count: number;
    };
  };
  by_plan: {
    [key: string]: {
      approved: number;
      project_count: number;
    };
  };
  metadata: {
    total_projects: number;
    year: string;
  };
}

interface Project {
  id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  location: string;
  status: 'completed' | 'in-progress';
  hasLocation: boolean;
  disbursed: number;
  remaining: number;
  increase: number;
  decrease: number;
  committed: number;
}

const Index = () => {
  const [budgetData, setBudgetData] = useState<BudgetSummary2569 | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem2569[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [amountProject, setAmountProject] = useState<number>(0);
  const [completedProjectCount, setCompletedProjectCount] = useState<number>(0);
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const [publicProjects, setPublicProjects] = useState<Project[]>([]);
  const [publicDataSummary, setPublicDataSummary] = useState<{
    total: {
      approved: number;
      disbursed: number;
      committed: number;
      remaining: number;
    };
  } | null>(null);
  const [publicProjectsLoading, setPublicProjectsLoading] = useState(true);
  const [publicProjectsDate, setPublicProjectsDate] = useState<string | null>(null);
  const [publicProjectsCount, setPublicProjectsCount] = useState<number>(0);

  // ฟังก์ชันสำหรับประมวลผลข้อมูลงบประมาณ 2569
  const processBudgetData2569 = (items: BudgetItem2569[]): BudgetSummary2569 => {
    const totalApproved = items.reduce((sum, item) => sum + item.budget, 0);

    // จัดกลุ่มตาม lvl1 (หมวดงบประมาณหลัก)
    const byLvl1: { [key: string]: { approved: number; project_count: number } } = {};
    items.forEach(item => {
      if (!byLvl1[item.lvl1]) {
        byLvl1[item.lvl1] = { approved: 0, project_count: 0 };
      }
      byLvl1[item.lvl1].approved += item.budget;
      byLvl1[item.lvl1].project_count += 1;
    });

    // จัดกลุ่มตาม plan (แผนงาน)
    const byPlan: { [key: string]: { approved: number; project_count: number } } = {};
    items.forEach(item => {
      if (!byPlan[item.plan]) {
        byPlan[item.plan] = { approved: 0, project_count: 0 };
      }
      byPlan[item.plan].approved += item.budget;
      byPlan[item.plan].project_count += 1;
    });

    return {
      total: {
        approved: totalApproved,
        disbursed: 0, // ข้อมูล 2569 ไม่มีข้อมูลการเบิกจ่าย
        committed: 0, // ข้อมูล 2569 ไม่มีข้อมูลการผูกพัน
        remaining: totalApproved, // งบประมาณคงเหลือเท่ากับงบที่อนุมัติ
      },
      by_lvl1: byLvl1,
      by_plan: byPlan,
      metadata: {
        total_projects: items.length,
        year: '2569'
      }
    };
  };

  const fetchPublicProjects = async () => {
    try {
      const response = await fetch('/20250519-eplan.json');
      const data = await response.json();
      // setPublicProjects(data.budget_data);
      setPublicProjectsDate(data.metadata.date);
      setPublicDataSummary(data.summary);
      setPublicProjectsCount(data.metadata.total_projects);
    } catch (error) {
      console.error('Error fetching public projects:', error);
    } finally {
      setPublicProjectsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ CSV
  const downloadCSV = () => {
    if (!budgetItems.length) return;

    // สร้างหัวข้อ CSV
    const headers = ['ลำดับ', 'หมวดงบประมาณหลัก', 'หมวดงบประมาณย่อย', 'โครงการ/กิจกรรม', 'แผนงาน', 'งบประมาณ (บาท)'];

    // แปลงข้อมูลเป็น CSV
    const csvContent = [
      headers.join(','),
      ...budgetItems.map((item, index) => [
        index + 1,
        `"${item.lvl1}"`,
        `"${item.lvl2}"`,
        `"${item.project}"`,
        `"${item.plan}"`,
        item.budget
      ].join(','))
    ].join('\n');

    // สร้าง Blob และดาวน์โหลด
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `งบประมาณ_2569_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ฟังก์ชันสำหรับเปิด/ดาวน์โหลดไฟล์ PDF
  const openPDF = () => {
    const pdfUrl = '/pdf/budgeting-2569.pdf';
    window.open(pdfUrl, '_blank');
  };

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  useEffect(() => {
    const fetchBudgetData2569 = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/budgeting/2569/budgeting.json');
        const data: BudgetItem2569[] = await response.json();

        // ประมวลผลข้อมูล
        const processedData = processBudgetData2569(data);
        setBudgetData(processedData);
        setBudgetItems(data);
        setDate('2569');
        setAmountProject(data.length);

        // คำนวณจำนวนโครงการที่เกี่ยวข้องกับการก่อสร้าง
        // เอาทุกหมวด ไม่ต้องกรอง
        // กรองเฉพาะงบดำเนินงานและงบลงทุน
        const constructionProjects = data.filter(
          (item) => item.lvl1 === 'งบลงทุน'
        );
        setCompletedProjectCount(0); // ข้อมูล 2569 ไม่มีสถานะการดำเนินงาน

        // แปลงข้อมูลและเรียงลำดับตามงบประมาณสูงสุด
        const transformedProjects = constructionProjects
          .map((item, index) => ({
            id: (index + 1).toString(),
            name: item.project,
            category: item.lvl1,
            budget: item.budget,
            spent: 0, // ข้อมูล 2569 ไม่มีข้อมูลการเบิกจ่าย
            location: '-',
            status: 'in-progress' as const,
            hasLocation: false,
            disbursed: 0,
            remaining: item.budget,
            increase: 0,
            decrease: 0,
            committed: 0,
          }))
          .sort((a, b) => b.budget - a.budget)
          .slice(0, 10);

        setTopProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching budget data 2569:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData2569();
  }, []);

  const budgetAllocationData = useMemo(() => {
    if (!budgetData?.by_lvl1) return [];

    return Object.entries(budgetData.by_lvl1)
      .map(([name, data]) => ({
        name,
        value: data.approved,
        color: '#00acff'
      }))
      .sort((a, b) => b.value - a.value);
  }, [budgetData]);

  const planAllocationData = useMemo(() => {
    if (!budgetData?.by_plan) return [];

    return Object.entries(budgetData.by_plan)
      .map(([name, data]) => ({
        name,
        value: data.approved,
        color: '#4ade80'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // แสดงเฉพาะ 10 แผนงานที่มีงบประมาณสูงสุด
  }, [budgetData]);

  const publicBudgetProgressData = useMemo(() => {
    if (!publicDataSummary) return [];

    return [
      { name: 'เบิกจ่าย', value: publicDataSummary?.total.disbursed, color: '#4ade80' },
      { name: 'งบประมาณคงเหลือ', value: publicDataSummary.total.remaining, color: '#94a3b8' },
    ];
  }, [publicDataSummary]);

  const completedProjects = useMemo(() => {
    return completedProjectCount;
  }, [completedProjectCount]);

  const inProgressProjects = useMemo(() => {
    return amountProject - completedProjectCount;
  }, [amountProject, completedProjectCount]);

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
        title="ภาพรวมงบประมาณ"
        description="แสดงข้อมูลงบประมาณประจำปี 2569 ขององค์การบริหารส่วนจังหวัดลำพูน"
        date={date}
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="งบประมาณทั้งหมด"
            value={formatCurrency(budgetData?.total.approved)}
            description="งบประมาณรายจ่ายประจำปี 2569"
            trend="up"
            icon={<Layers />}
          />
          <StatCard
            title="งบลงทุน"
            value={formatCurrency(budgetData?.by_lvl1?.["งบลงทุน"]?.approved || 0)}
            description={`คิดเป็น ${formatPercentage(budgetData?.by_lvl1?.["งบลงทุน"]?.approved || 0, budgetData?.total.approved)} ของงบทั้งหมด`}
            trend="up"
            icon={<ArrowUpRight />}
          />
          <StatCard
            title="งบดำเนินงาน"
            value={formatCurrency(budgetData?.by_lvl1?.["งบดำเนินงาน"]?.approved || 0)}
            description={`คิดเป็น ${formatPercentage(budgetData?.by_lvl1?.["งบดำเนินงาน"]?.approved || 0, budgetData?.total.approved)} ของงบทั้งหมด`}
            icon={<Building />}
          /> 
          <StatCard
            title="จำนวนรายการ"
            value={`${formatNumber(amountProject)} รายการ`}
            description={`จำนวนรายการงบประมาณทั้งหมด`}
            icon={<Landmark />}
            action={
              <Button variant="outline" asChild className="w-full mt-2">
                <Link to="/projects/2569" className="flex items-center justify-center gap-2">
                  ดูรายการโครงการ
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </div>

        {/* ปุ่มดาวน์โหลดไฟล์ */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={downloadCSV}
            disabled={!budgetItems.length}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Download className="h-5 w-5 mr-2" />
            ดาวน์โหลดข้อมูล (CSV)
          </Button>
          <Button
            onClick={openPDF}
            size="lg"
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FileText className="h-5 w-5 mr-2" />
            เปิดข้อบัญญัติ (PDF)
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">การจัดสรรงบประมาณตามหมวดหมู่</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                แสดงสัดส่วนงบประมาณแยกตามหมวดงบประมาณหลัก
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetAllocationChart data={budgetAllocationData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">การจัดสรรงบประมาณตามแผนงาน</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                แสดงสัดส่วนงบประมาณแยกตามแผนงานหลัก
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetAllocationChart data={planAllocationData} />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-lg sm:text-xl">โครงการงบลงทุนมูลค่าสูงสุด</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                แสดง 10 โครงการงบลงทุนที่มีงบประมาณสูงที่สุด
              </CardDescription>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/projects/2569" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                ดูโครงการทั้งหมด
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ProjectsTable projects={topProjects} />
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default Index;
