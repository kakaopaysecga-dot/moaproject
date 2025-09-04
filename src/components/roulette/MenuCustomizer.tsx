import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Palette, RotateCcw, Download, Upload } from 'lucide-react';
import { RouletteOption } from '@/hooks/useRoulette';

interface MenuCustomizerProps {
  options: RouletteOption[];
  onOptionsChange: (options: RouletteOption[]) => void;
  onClose: () => void;
}

const defaultMenus = [
  '삼겹살', '갈비', '불고기', '비빔밥', '냉면', '김치찌개',
  '된장찌개', '순두부찌개', '부대찌개', '닭갈비', '치킨',
  '피자', '햄버거', '파스타', '돈까스', '회', '초밥',
  '짜장면', '짬뽕', '탕수육', '마라탕', '쌀국수', '팔타이',
  '카레', '라멘', '우동', '소바', '덮밥', '김밥'
];

const colorOptions = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(220, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(160, 70%, 50%)',
  'hsl(40, 70%, 50%)',
  'hsl(320, 70%, 50%)',
  'hsl(200, 70%, 50%)',
  'hsl(120, 70%, 50%)'
];

export const MenuCustomizer: React.FC<MenuCustomizerProps> = ({
  options,
  onOptionsChange,
  onClose
}) => {
  const [newMenuText, setNewMenuText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const addMenu = () => {
    if (!newMenuText.trim()) return;
    
    const newOption: RouletteOption = {
      id: Date.now().toString(),
      label: newMenuText.trim(),
      color: colorOptions[options.length % colorOptions.length]
    };
    
    onOptionsChange([...options, newOption]);
    setNewMenuText('');
  };

  const removeMenu = (id: string) => {
    onOptionsChange(options.filter(option => option.id !== id));
  };

  const startEdit = (option: RouletteOption) => {
    setEditingId(option.id);
    setEditingText(option.label);
  };

  const saveEdit = () => {
    if (!editingText.trim() || !editingId) return;
    
    onOptionsChange(options.map(option => 
      option.id === editingId 
        ? { ...option, label: editingText.trim() }
        : option
    ));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const changeColor = (id: string, color: string) => {
    onOptionsChange(options.map(option =>
      option.id === id
        ? { ...option, color }
        : option
    ));
  };

  const resetToDefault = () => {
    const defaultOptions: RouletteOption[] = defaultMenus.map((menu, index) => ({
      id: index.toString(),
      label: menu,
      color: colorOptions[index % colorOptions.length]
    }));
    onOptionsChange(defaultOptions);
  };

  const exportOptions = () => {
    const dataStr = JSON.stringify(options, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'lunch-menu-options.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported) && imported.every(item => 
          typeof item === 'object' && 'id' in item && 'label' in item
        )) {
          onOptionsChange(imported);
        } else {
          alert('올바르지 않은 파일 형식입니다.');
        }
      } catch (error) {
        alert('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>메뉴 커스터마이징</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 새 메뉴 추가 */}
        <div className="flex gap-2">
          <Input
            placeholder="새 메뉴 추가..."
            value={newMenuText}
            onChange={(e) => setNewMenuText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMenu()}
            className="flex-1"
          />
          <Button onClick={addMenu} disabled={!newMenuText.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* 메뉴 목록 */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <div key={option.id} className="flex items-center gap-2 p-2 rounded-lg border">
              {editingId === option.id ? (
                <>
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    onBlur={saveEdit}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={saveEdit}>
                    ✓
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    ✕
                  </Button>
                </>
              ) : (
                <>
                  <Badge 
                    className="flex-1 justify-start cursor-pointer hover:bg-muted"
                    style={{ backgroundColor: option.color, color: 'white' }}
                    onClick={() => startEdit(option)}
                  >
                    {option.label}
                  </Badge>
                  
                  {/* 색상 선택 */}
                  <div className="flex gap-1">
                    {colorOptions.slice(0, 4).map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => changeColor(option.id, color)}
                      />
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMenu(option.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 전체 색상 팔레트 */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            전체 색상 팔레트
          </label>
          <div className="grid grid-cols-6 gap-2">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  // 마지막으로 추가된 메뉴의 색상 변경
                  if (options.length > 0) {
                    const lastOption = options[options.length - 1];
                    changeColor(lastOption.id, color);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefault}>
              <RotateCcw className="w-4 h-4 mr-2" />
              기본값 복원
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportOptions}>
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
            
            <label className="inline-flex">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  가져오기
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importOptions}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          총 {options.length}개의 메뉴가 등록되어 있습니다.
        </div>
      </CardContent>
    </Card>
  );
};