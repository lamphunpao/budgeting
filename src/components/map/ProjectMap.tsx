import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import 'maplibre-gl/dist/maplibre-gl.css';

interface Project {
  id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  location: string;
  status: 'completed' | 'in-progress' | 'planned';
  coordinates: {
    lat: number;
    lng: number;
  };
};

interface ProjectMapProps {
  projects: Project[];
};

// Initial view state: Lamphun
const INITIAL_VIEW_STATE = {
  longitude: 98.93273443954536,
  latitude: 18.09850631134027,
  zoom: 8
};

const ProjectMap = ({ projects }: ProjectMapProps) => {
  const [searchParams] = useSearchParams();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [popupInfo, setPopupInfo] = useState<Project | null>(null);

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setViewState({
          longitude: project.coordinates.lng,
          latitude: project.coordinates.lat,
          zoom: 14
        });
      }
    }
  }, [projects, searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'แล้วเสร็จ';
      case 'in-progress': return 'กำลังดำเนินการ';
      case 'planned': return 'วางแผน';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card className="h-[500px]">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">แผนที่แสดงตำแหน่งโครงการ</CardTitle>
              <CardDescription>
                คลิกที่จุดบนแผนที่เพื่อดูรายละเอียดโครงการ
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: '100%', height: '100%'}}
                mapStyle={{
                  version: 8,
                  sources: {
                    'osm': {
                      type: 'raster',
                      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                      tileSize: 256,
                      attribution: '© OpenStreetMap contributors'
                    }
                  },
                  layers: [
                    {
                      id: 'osm-tiles',
                      type: 'raster',
                      source: 'osm',
                      minzoom: 0,
                      maxzoom: 19
                    }
                  ]
                }}
              >
                <NavigationControl position="top-right" />
                
                {projects.map((project) => (
                  <Marker
                    key={project.id}
                    longitude={project.coordinates.lng}
                    latitude={project.coordinates.lat}
                    color={
                      project.status === 'completed' ? '#4ade80' :
                      project.status === 'in-progress' ? '#f59e0b' : '#94a3b8'
                    }
                    onClick={e => {
                      e.originalEvent.stopPropagation();
                      setPopupInfo(project);
                      setSelectedProject(project);
                    }}
                  />
                ))}

                {popupInfo && (
                  <Popup
                    longitude={popupInfo.coordinates.lng}
                    latitude={popupInfo.coordinates.lat}
                    anchor="bottom"
                    onClose={() => setPopupInfo(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-medium">{popupInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">{popupInfo.category}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">งบประมาณ:</span>
                          <span className="font-medium">{formatCurrency(popupInfo.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">สถานะ:</span>
                          <span className="font-medium">{getStatusText(popupInfo.status)}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                )}
              </Map>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-[500px]">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">ข้อมูลโครงการ</CardTitle>
              <CardDescription>
                {selectedProject ? 'รายละเอียดโครงการที่เลือก' : 'เลือกโครงการบนแผนที่'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProject ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{selectedProject.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProject.category}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">งบประมาณ:</span>
                      <span className="font-medium">{formatCurrency(selectedProject.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">การใช้จ่าย:</span>
                      <span className="font-medium">{formatCurrency(selectedProject.spent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">คงเหลือ:</span>
                      <span className="font-medium">{formatCurrency(selectedProject.budget - selectedProject.spent)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">สถานที่:</p>
                    <p className="text-sm">{selectedProject.location}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">พิกัด:</p>
                    <p className="text-sm">
                      Lat: {selectedProject.coordinates.lat}, Lng: {selectedProject.coordinates.lng}
                      <br />
                      <span className="text-xs text-muted-foreground">พิกัดอาจคาดเคลื่อน</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">
                    เลือกโครงการบนแผนที่เพื่อดูรายละเอียด
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
