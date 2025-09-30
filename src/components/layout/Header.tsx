
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const FISCAL_YEARS = ['2569'];

const Header = () => {
  const [selectedYear, setSelectedYear] = useState('2569');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="flex items-center gap-2 text-lg font-medium">
                  หน้าหลัก
                </Link>
                {/* <Link to="/public-projects" className="flex items-center gap-2 text-lg font-medium">
                  โครงการสาธารณะ
                </Link>
                <Link to="/map" className="flex items-center gap-2 text-lg font-medium">
                  แผนที่โครงการ
                </Link> */}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo-ci-blue.png" alt="Logo อบจ.ลำพูน" className="h-10 w-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-lg hidden md:inline-block">ระบบติดตามงบประมาณ</span>
              <span className="text-xs text-muted-foreground hidden md:inline-block">องค์การบริหารส่วนจังหวัดลำพูน</span>
            </div>
            <span className="font-bold text-lg md:hidden">งบประมาณ</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              หน้าหลัก
            </Link>
            {/* <Link to="/public-projects" className="text-sm font-medium transition-colors hover:text-primary">
              โครงการสาธารณะ
            </Link> */}
            <Link to="/projects/2569" className="text-sm font-medium transition-colors hover:text-primary">
              รายการโครงการ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="hidden sm:inline-block">ปีงบประมาณ:</span>
          </div>
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="เลือกปี" />
            </SelectTrigger>
            <SelectContent>
              {FISCAL_YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default Header;
