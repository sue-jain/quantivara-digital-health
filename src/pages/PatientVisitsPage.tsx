import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, Plus } from 'lucide-react';
import patientCareTeamService, { AvailableDoctor } from '@/services/patientCareTeam';
import { useAuth } from '@/contexts/AuthContext';

type Visit = {
  id: string;
  doctorName: string;
  date: string; // ISO
  status: 'upcoming' | 'completed';
};

const PatientVisitsPage: React.FC = () => {
  const { user } = useAuth();
  const [openUpcoming, setOpenUpcoming] = useState(true);
  const [openPast, setOpenPast] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showBook, setShowBook] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState<AvailableDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // demo seed
    const now = new Date();
    const future = new Date(now.getTime() + 7*24*60*60*1000);
    const past = new Date(now.getTime() - 10*24*60*60*1000);
    setVisits([
      { id: 'v1', doctorName: 'Dr. Meera Patel', date: future.toISOString(), status: 'upcoming' },
      { id: 'v2', doctorName: 'Dr. Rajesh Verma', date: past.toISOString(), status: 'completed' },
    ]);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await patientCareTeamService.getAvailableDoctors();
        setAvailableDoctors(docs);
      } catch {}
    };
    load();
  }, [user]);

  const bookAppointment = () => {
    if (!selectedDoctor || !selectedDate) return;
    const doctor = availableDoctors.find(d => d.id === selectedDoctor);
    setVisits(prev => ([
      { id: `v-${Date.now()}`, doctorName: doctor?.name || 'Doctor', date: new Date(selectedDate).toISOString(), status: 'upcoming' },
      ...prev,
    ]));
    setShowBook(false);
    setSelectedDoctor('');
    setSelectedDate('');
    setOpenUpcoming(true);
  };

  const upcoming = visits.filter(v => v.status === 'upcoming').sort((a,b)=> a.date.localeCompare(b.date));
  const past = visits.filter(v => v.status === 'completed').sort((a,b)=> b.date.localeCompare(a.date));

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-gray-900">Visits</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowBook(true)} title="Book appointment">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Your upcoming and past doctor visits</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Upcoming */}
          <Card className="mb-4">
            <CardHeader onClick={() => setOpenUpcoming(v=>!v)} className="cursor-pointer">
              <CardTitle className="flex items-center justify-between text-gray-900">
                <span>Upcoming</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openUpcoming ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
            {openUpcoming && (
              <CardContent>
                {upcoming.length === 0 ? (
                  <div className="text-sm text-gray-500">No upcoming visits</div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map(v => (
                      <div key={v.id} className="p-3 border rounded-md flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{v.doctorName}</div>
                          <div className="text-xs text-gray-600">{new Date(v.date).toLocaleString()}</div>
                        </div>
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Past */}
          <Card>
            <CardHeader onClick={() => setOpenPast(v=>!v)} className="cursor-pointer">
              <CardTitle className="flex items-center justify-between text-gray-900">
                <span>Past</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openPast ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
            {openPast && (
              <CardContent>
                {past.length === 0 ? (
                  <div className="text-sm text-gray-500">No past visits</div>
                ) : (
                  <div className="space-y-3">
                    {past.map(v => (
                      <div key={v.id} className="p-3 border rounded-md flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{v.doctorName}</div>
                          <div className="text-xs text-gray-600">{new Date(v.date).toLocaleString()}</div>
                        </div>
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Book modal (lightweight inline) */}
          {showBook && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-900">Book Appointment</div>
                  <button className="text-sm text-gray-500" onClick={() => setShowBook(false)}>Close</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                    <select value={selectedDoctor} onChange={(e)=>setSelectedDoctor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a doctor...</option>
                      {availableDoctors.map(d => (
                        <option key={d.id} value={d.id}>{d.displayName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
                    <input type="datetime-local" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" onClick={()=>setShowBook(false)}>Cancel</Button>
                    <Button onClick={bookAppointment} disabled={!selectedDoctor || !selectedDate} style={{ backgroundColor: '#BBF1F1', color: '#374151' }}>Book</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientVisitsPage;


