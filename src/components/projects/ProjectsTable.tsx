import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  MapPin 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface Project {
  id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  location: string;
  status: 'completed' | 'in-progress' | 'planned';
  hasLocation: boolean;
  disbursed: number;
  remaining: number;
  increase: number;
  decrease: number;
  committed: number;
}

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const pageSize = 10;
  const navigate = useNavigate();

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredProjects.length / pageSize);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">เสร็จสิ้น</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">ดำเนินการ</Badge>;
      case 'planned':
        return <Badge className="bg-blue-500">วางแผนแล้ว</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleMapClick = (projectId: string) => {
    navigate(`/map?project=${projectId}`);
  };

  const toggleRow = (projectId: string) => {
    setExpandedRows(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ค้นหาโครงการ..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border bg-white">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[3%]"></TableHead>
              <TableHead className="w-[34%]">ชื่อโครงการ</TableHead>
              <TableHead className="w-[12%] text-right">งบประมาณ</TableHead>
              <TableHead className="w-[12%] text-right">เบิกจ่าย</TableHead>
              <TableHead className="w-[12%] text-right">คงเหลือ</TableHead>
              <TableHead className="w-[8%]">สถานะ</TableHead>
              <TableHead className="w-[7%] text-center">แผนที่</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <React.Fragment key={project.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50 border-b"
                    onClick={() => toggleRow(project.id)}
                  >
                    <TableCell className="w-[3%] text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(project.id);
                        }}
                      >
                        {expandedRows.includes(project.id) ? "▼" : "▶"}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal">
                      <div className="break-words">
                        {project.name}
                        {/* <div className="text-xs text-muted-foreground mt-0.5">
                          หมวด: {project.category}
                        </div> */}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(project.budget)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(project.disbursed)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(project.remaining)}
                    </TableCell>
                    <TableCell>วางแผนแล้ว</TableCell>
                    <TableCell className="text-center">
                      {project.hasLocation ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMapClick(project.id);
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          ไม่มีข้อมูล
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRows.includes(project.id) && (
                    <TableRow className="bg-muted/20 border-b">
                      <TableCell colSpan={7} className="py-3">
                        <div className="grid grid-cols-3 gap-4 px-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              งบผูกพัน
                            </div>
                            <div className="font-medium tabular-nums">
                              {formatCurrency(project.committed)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              งบโอนเพิ่ม
                            </div>
                            <div className="font-medium text-green-600 tabular-nums">
                              +{formatCurrency(project.increase)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              งบโอนลด
                            </div>
                            <div className="font-medium text-red-600 tabular-nums">
                              -{formatCurrency(project.decrease)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  ไม่พบโครงการที่ค้นหา
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedProjects.length > 0 ? (
          paginatedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border p-4 space-y-3"
            >
              <div className="space-y-1">
                <h3 className="font-medium text-base break-words">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.category}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">งบประมาณ</span>
                  <span className="font-medium">
                    {formatCurrency(project.budget)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">เบิกจ่าย</span>
                  <span className="font-medium">
                    {formatCurrency(project.disbursed)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">คงเหลือ</span>
                  <span className="font-medium">
                    {formatCurrency(project.remaining)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-primary justify-start p-0 h-auto hover:bg-transparent"
                  onClick={() => toggleRow(project.id)}
                >
                  <span className="text-sm underline">
                    ดูรายละเอียดเพิ่มเติม
                  </span>
                </Button>
                {expandedRows.includes(project.id) && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">งบผูกพัน</span>
                      <span className="font-medium">
                        {formatCurrency(project.committed)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">งบโอนเพิ่ม</span>
                      <span className="font-medium text-green-600">
                        +{formatCurrency(project.increase)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">งบโอนลด</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(project.decrease)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {project.location !== "-"
                    ? project.location
                    : "ไม่ระบุพื้นที่"}
                </div>
                {getStatusBadge(project.status)}
              </div>

              {project.hasLocation && (
                <div className="flex justify-end pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    onClick={() => handleMapClick(project.id)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    ดูแผนที่
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            ไม่พบโครงการที่ค้นหา
          </div>
        )}
      </div>

      {filteredProjects.length > pageSize && (
        <div className="flex items-center justify-center md:justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
            }
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage(
                currentPage < totalPages ? currentPage + 1 : totalPages
              )
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
