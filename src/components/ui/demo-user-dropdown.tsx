import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import apiClient, { API_ENDPOINTS } from '@/config/api';

export interface DemoUser {
  abhaId: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  conditions: string[];
  allergies: string[];
  medications: string[];
  displayName: string;
}

interface DemoUserDropdownProps {
  onUserSelect: (user: DemoUser) => void;
  placeholder?: string;
  className?: string;
  showUserDetails?: boolean;
  disabled?: boolean;
}

const DemoUserDropdown: React.FC<DemoUserDropdownProps> = ({
  onUserSelect,
  placeholder = "Select a demo patient...",
  className = "",
  showUserDetails = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDemoUsers();
  }, []);

  const fetchDemoUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient<{ users: DemoUser[] }>(API_ENDPOINTS.demo.users);
      console.log('Demo users fetched:', response.data.users);
      
      // Debug each user's conditions
      response.data.users.forEach(user => {
        console.log(`User ${user.name}:`, {
          conditions: user.conditions,
          conditionsType: typeof user.conditions,
          conditionsLength: user.conditions?.length
        });
      });
      
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch demo users:', error);
      toast({
        title: "Error",
        description: "Failed to load demo users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.abhaId.includes(searchTerm) ||
    user.conditions.some(condition => 
      condition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleUserSelect = (user: DemoUser) => {
    setSelectedUser(user);
    onUserSelect(user);
    setIsOpen(false);
    setSearchTerm('');
  };

  const formatAbhaId = (abhaId: string) => {
    return abhaId.replace(/(\d{4})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4');
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className="w-full justify-between"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading demo users...
          </>
        ) : selectedUser ? (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="truncate">{selectedUser.name}</span>
            <Badge variant="secondary" className="text-xs">
              {formatAbhaId(selectedUser.abhaId)}
            </Badge>
          </div>
        ) : (
          <>
            <User className="h-4 w-4" />
            {placeholder}
          </>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-0">
            {/* Search Input */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ABHA ID, or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchTerm ? 'No users found' : 'No demo users available'}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.abhaId}
                    onClick={() => handleUserSelect(user)}
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {user.gender}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {formatAbhaId(user.abhaId)}
                      </Badge>
                    </div>
                    
                                         {showUserDetails && (
                       <div className="mt-1">
                         <div className="text-xs text-muted-foreground">
                           ({user.firstName} - {user.conditions && user.conditions.length > 0 ? user.conditions[0] : 'No conditions'})
                         </div>
                       </div>
                     )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t bg-muted/50">
              <div className="text-xs text-muted-foreground text-center">
                {filteredUsers.length} demo patient{filteredUsers.length !== 1 ? 's' : ''} available
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemoUserDropdown; 