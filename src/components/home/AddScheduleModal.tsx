import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useScheduleStore, ScheduleItem } from '@/store/scheduleStore';
import { toast } from 'sonner';

interface AddScheduleModalProps {
  children?: React.ReactNode;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<ScheduleItem['type']>('task');
  const [priority, setPriority] = useState<ScheduleItem['priority']>('medium');
  
  const { addScheduleItem } = useScheduleStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !time.trim()) {
      toast.error('제목과 시간을 입력해주세요');
      return;
    }

    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      title: title.trim(),
      time: time.trim(),
      type,
      location: location.trim() || undefined,
      priority,
      completed: false
    };

    addScheduleItem(newItem);
    toast.success('일정이 추가되었습니다');
    
    // Reset form
    setTitle('');
    setTime('');
    setLocation('');
    setType('task');
    setPriority('medium');
    setOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setTime('');
    setLocation('');
    setType('task');
    setPriority('medium');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 일정 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정 제목을 입력하세요"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">시간</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>종류</Label>
              <Select value={type} onValueChange={(value: ScheduleItem['type']) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">🤝 회의</SelectItem>
                  <SelectItem value="task">📋 업무</SelectItem>
                  <SelectItem value="reminder">⏰ 알림</SelectItem>
                  <SelectItem value="personal">🌟 개인</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>우선순위</Label>
              <Select value={priority} onValueChange={(value: ScheduleItem['priority']) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">장소 (선택)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="장소"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};