import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CodeBlock {
  id: string;
  type: string;
  label: string;
  category: 'motion' | 'looks' | 'sound' | 'events' | 'control' | 'sensing' | 'operators' | 'variables';
}

interface Sprite {
  id: string;
  name: string;
  emoji?: string;
  image?: string;
}

interface Sound {
  id: string;
  name: string;
  url: string;
}

interface Background {
  id: string;
  name: string;
  gradient: string;
}

interface CommunityProject {
  id: number;
  title: string;
  authorName: string;
  authorAvatar: string;
  thumbnail: string;
  likes: number;
  views: number;
  createdAt: string;
}

const codeBlocks: CodeBlock[] = [
  { id: '1', type: 'move', label: 'Переместить на 10 шагов', category: 'motion' },
  { id: '2', type: 'turn', label: 'Повернуть на 15 градусов', category: 'motion' },
  { id: '3', type: 'goto', label: 'Перейти в x: 0 y: 0', category: 'motion' },
  { id: '4', type: 'say', label: 'Сказать "Привет!" 2 секунды', category: 'looks' },
  { id: '5', type: 'show', label: 'Показать', category: 'looks' },
  { id: '6', type: 'hide', label: 'Спрятать', category: 'looks' },
  { id: '7', type: 'playsound', label: 'Играть звук', category: 'sound' },
  { id: '8', type: 'volume', label: 'Установить громкость на 100%', category: 'sound' },
  { id: '9', type: 'whenclicked', label: 'Когда нажат флаг', category: 'events' },
  { id: '10', type: 'whenkey', label: 'Когда нажата клавиша пробел', category: 'events' },
  { id: '11', type: 'wait', label: 'Ждать 1 секунд', category: 'control' },
  { id: '12', type: 'repeat', label: 'Повторить 10 раз', category: 'control' },
  { id: '13', type: 'touching', label: 'Касается...?', category: 'sensing' },
  { id: '14', type: 'mousepos', label: 'Позиция мыши x', category: 'sensing' },
  { id: '15', type: 'add', label: '+ сложить', category: 'operators' },
  { id: '16', type: 'random', label: 'Случайное число от 1 до 10', category: 'operators' },
  { id: '17', type: 'variable', label: 'Моя переменная', category: 'variables' },
  { id: '18', type: 'setvariable', label: 'Установить переменную на 0', category: 'variables' },
];

const categoryConfig = {
  motion: { name: 'Движение', color: 'bg-scratch-motion', icon: 'Move' },
  looks: { name: 'Внешность', color: 'bg-scratch-looks', icon: 'Eye' },
  sound: { name: 'Звук', color: 'bg-scratch-sound', icon: 'Volume2' },
  events: { name: 'События', color: 'bg-scratch-events', icon: 'Zap' },
  control: { name: 'Управление', color: 'bg-scratch-control', icon: 'Settings' },
  sensing: { name: 'Сенсоры', color: 'bg-scratch-sensing', icon: 'Radar' },
  operators: { name: 'Операторы', color: 'bg-scratch-operators', icon: 'Calculator' },
  variables: { name: 'Переменные', color: 'bg-scratch-variables', icon: 'Database' },
};

const spriteGallery = [
  { id: 's1', name: 'Кот', emoji: '🐱' },
  { id: 's2', name: 'Собака', emoji: '🐶' },
  { id: 's3', name: 'Лиса', emoji: '🦊' },
  { id: 's4', name: 'Панда', emoji: '🐼' },
  { id: 's5', name: 'Лягушка', emoji: '🐸' },
  { id: 's6', name: 'Единорог', emoji: '🦄' },
  { id: 's7', name: 'Бабочка', emoji: '🦋' },
  { id: 's8', name: 'Пчела', emoji: '🐝' },
  { id: 's9', name: 'Рыба', emoji: '🐠' },
  { id: 's10', name: 'Дракон', emoji: '🐉' },
  { id: 's11', name: 'Птица', emoji: '🐦' },
  { id: 's12', name: 'Ракета', emoji: '🚀' },
];

const backgroundGallery: Background[] = [
  { id: 'bg1', name: 'Небо', gradient: 'from-blue-400 to-blue-200' },
  { id: 'bg2', name: 'Закат', gradient: 'from-orange-500 to-pink-400' },
  { id: 'bg3', name: 'Космос', gradient: 'from-purple-900 to-black' },
  { id: 'bg4', name: 'Лес', gradient: 'from-green-600 to-green-300' },
  { id: 'bg5', name: 'Океан', gradient: 'from-blue-600 to-cyan-400' },
  { id: 'bg6', name: 'Пустыня', gradient: 'from-yellow-600 to-orange-300' },
  { id: 'bg7', name: 'Рассвет', gradient: 'from-pink-300 to-yellow-200' },
  { id: 'bg8', name: 'Ночь', gradient: 'from-indigo-900 to-purple-800' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryConfig>('motion');
  const [workspace, setWorkspace] = useState<CodeBlock[]>([]);
  const [sprites, setSprites] = useState<Sprite[]>([
    { id: '1', name: 'Кот', emoji: '🐱' },
  ]);
  const [selectedSprite, setSelectedSprite] = useState('1');
  const [draggedBlock, setDraggedBlock] = useState<CodeBlock | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [currentBackground, setCurrentBackground] = useState<Background>(backgroundGallery[0]);
  
  const [showSpriteDialog, setShowSpriteDialog] = useState(false);
  const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
  const [showSoundDialog, setShowSoundDialog] = useState(false);
  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);
  
  const soundInputRef = useRef<HTMLInputElement>(null);
  const spriteImageRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (block: CodeBlock, e: React.DragEvent | React.TouchEvent) => {
    setDraggedBlock(block);
    if ('dataTransfer' in e) {
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock) {
      setWorkspace([...workspace, { ...draggedBlock, id: `${draggedBlock.id}-${Date.now()}` }]);
      setDraggedBlock(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (draggedBlock) {
      const dropZone = document.getElementById('workspace-drop-zone');
      const touch = e.changedTouches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (dropZone && dropZone.contains(element)) {
        setWorkspace([...workspace, { ...draggedBlock, id: `${draggedBlock.id}-${Date.now()}` }]);
      }
      setDraggedBlock(null);
    }
  };

  const handleBlockClick = (block: CodeBlock) => {
    setWorkspace([...workspace, { ...block, id: `${block.id}-${Date.now()}` }]);
  };

  const addSpriteFromGallery = (sprite: typeof spriteGallery[0]) => {
    const newSprite = {
      id: Date.now().toString(),
      name: sprite.name,
      emoji: sprite.emoji,
    };
    setSprites([...sprites, newSprite]);
    setSelectedSprite(newSprite.id);
    setShowSpriteDialog(false);
  };

  const handleSpriteImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newSprite = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          image: event.target?.result as string,
        };
        setSprites([...sprites, newSprite]);
        setSelectedSprite(newSprite.id);
        setShowSpriteDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newSound = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: event.target?.result as string,
        };
        setSounds([...sounds, newSound]);
        setShowSoundDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectBackground = (bg: Background) => {
    setCurrentBackground(bg);
    setShowBackgroundDialog(false);
  };

  const removeBlock = (blockId: string) => {
    setWorkspace(workspace.filter(b => b.id !== blockId));
  };

  useEffect(() => {
    const loadCommunityProjects = async () => {
      try {
        setIsLoadingCommunity(true);
        const response = await fetch('https://functions.poehali.dev/a82f2799-0cb0-4ae2-9204-f040f132639d');
        const data = await response.json();
        setCommunityProjects(data.projects || []);
      } catch (error) {
        console.error('Failed to load community projects:', error);
      } finally {
        setIsLoadingCommunity(false);
      }
    };

    if (activeTab === 'community') {
      loadCommunityProjects();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎮</div>
            <h1 className="text-2xl font-bold text-primary">Block Code</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
              <Icon name="Play" size={16} className="mr-2" />
              Запустить
            </Button>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-64px)]">
        <div className="border-b bg-white">
          <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="editor" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Icon name="Code" size={18} className="mr-2" />
              Редактор
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Icon name="FolderOpen" size={18} className="mr-2" />
              Проекты
            </TabsTrigger>
            <TabsTrigger 
              value="learn" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Icon name="GraduationCap" size={18} className="mr-2" />
              Обучение
            </TabsTrigger>
            <TabsTrigger 
              value="community" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Icon name="Users" size={18} className="mr-2" />
              Сообщество
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="editor" className="h-full m-0 p-0">
          <div className="grid grid-cols-[300px_1fr_400px] h-full">
            <div className="border-r bg-white flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold mb-3">Блоки кода</h2>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? 'default' : 'outline'}
                      size="sm"
                      className={`justify-start text-xs ${
                        selectedCategory === key ? config.color + ' text-white hover:opacity-90' : ''
                      }`}
                      onClick={() => setSelectedCategory(key as keyof typeof categoryConfig)}
                    >
                      <Icon name={config.icon as any} size={14} className="mr-1" />
                      {config.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {codeBlocks
                    .filter(block => block.category === selectedCategory)
                    .map(block => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(block, e)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleDragStart(block, e)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={() => handleBlockClick(block)}
                        className={`w-full p-3 rounded-lg text-left ${categoryConfig[block.category].color} text-white hover:opacity-80 border-0 shadow-md cursor-move transition-transform active:scale-95 select-none`}
                      >
                        {block.label}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>

            <div className="bg-gradient-to-br from-background to-muted/30 p-6">
              <div className="h-full flex flex-col">
                <div 
                  id="workspace-drop-zone"
                  className="flex-1 bg-white rounded-lg shadow-lg border p-6 mb-4"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">РАБОЧАЯ ОБЛАСТЬ</h3>
                  <ScrollArea className="h-[calc(100%-2rem)]">
                    {workspace.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                        <Icon name="MousePointerClick" size={48} className="mb-4 opacity-50" />
                        <p className="text-center">Перетащите блоки сюда<br />или нажмите на них</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {workspace.map((block) => (
                          <div
                            key={block.id}
                            className={`${categoryConfig[block.category].color} text-white p-3 rounded-lg shadow-md animate-scale-in flex items-center justify-between group`}
                          >
                            <span>{block.label}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-white/20"
                              onClick={() => removeBlock(block.id)}
                            >
                              <Icon name="X" size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </div>

            <div className="border-l bg-white flex flex-col">
              <div className="p-4 border-b">
                <div 
                  className={`bg-gradient-to-br ${currentBackground.gradient} rounded-lg aspect-video border-2 border-muted-foreground/30 flex items-center justify-center mb-4 relative cursor-pointer hover:border-primary transition-colors`}
                  onClick={() => setShowBackgroundDialog(true)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-2">
                      {sprites.find(s => s.id === selectedSprite)?.image ? (
                        <img 
                          src={sprites.find(s => s.id === selectedSprite)?.image} 
                          alt="sprite" 
                          className="w-16 h-16 object-contain mx-auto"
                        />
                      ) : (
                        sprites.find(s => s.id === selectedSprite)?.emoji
                      )}
                    </div>
                    <p className="text-xs text-white/80 font-medium bg-black/20 px-2 py-1 rounded">Сцена</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Спрайты</h3>
                  <Button size="sm" variant="outline" onClick={() => setShowSpriteDialog(true)}>
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {sprites.map(sprite => (
                    <Card
                      key={sprite.id}
                      className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                        selectedSprite === sprite.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedSprite(sprite.id)}
                    >
                      <div className="flex items-center gap-3">
                        {sprite.image ? (
                          <img src={sprite.image} alt={sprite.name} className="w-10 h-10 object-contain" />
                        ) : (
                          <div className="text-3xl">{sprite.emoji}</div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{sprite.name}</p>
                          <p className="text-xs text-muted-foreground">Спрайт</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="font-semibold text-sm mb-3">Библиотека</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowBackgroundDialog(true)}
                    >
                      <Icon name="Image" size={16} className="mr-2" />
                      Фоны ({backgroundGallery.length})
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowSoundDialog(true)}
                    >
                      <Icon name="Music" size={16} className="mr-2" />
                      Звуки ({sounds.length})
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="h-full m-0 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Мои проекты</h2>
              <Button className="bg-primary">
                <Icon name="Plus" size={18} className="mr-2" />
                Новый проект
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 aspect-video flex items-center justify-center">
                    <div className="text-6xl">🎮</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">Моя игра {i}</h3>
                    <p className="text-sm text-muted-foreground">Изменено 2 дня назад</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learn" className="h-full m-0 p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Обучающие материалы</h2>
            <div className="space-y-4">
              {[
                { title: 'Основы блочного программирования', icon: '📚', level: 'Начальный' },
                { title: 'Создание анимации', icon: '🎬', level: 'Начальный' },
                { title: 'Управление звуком', icon: '🎵', level: 'Средний' },
                { title: 'Создание игр', icon: '🎮', level: 'Продвинутый' },
              ].map((lesson, i) => (
                <Card key={i} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{lesson.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">Уровень: {lesson.level}</p>
                    </div>
                    <Button>
                      <Icon name="Play" size={18} className="mr-2" />
                      Начать
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="community" className="h-full m-0 p-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Сообщество</h2>
            {isLoadingCommunity ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={48} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="bg-gradient-to-br from-accent/20 to-primary/20 aspect-video flex items-center justify-center">
                      <div className="text-6xl">{project.thumbnail}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">{project.authorAvatar}</div>
                        <p className="font-medium text-sm">{project.authorName}</p>
                      </div>
                      <h3 className="font-semibold mb-2">{project.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Heart" size={14} />
                          {project.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Eye" size={14} />
                          {project.views}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="h-full m-0 p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl">
                  👨‍💻
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Мой профиль</h2>
                  <p className="text-muted-foreground mb-4">Юный разработчик игр</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="Settings" size={16} className="mr-2" />
                      Настройки
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Статистика</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">5</div>
                      <p className="text-sm text-muted-foreground">Проектов</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-3xl font-bold text-secondary mb-1">12</div>
                      <p className="text-sm text-muted-foreground">Уроков</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-3xl font-bold text-accent mb-1">247</div>
                      <p className="text-sm text-muted-foreground">Лайков</p>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Достижения</h3>
                  <div className="flex gap-4">
                    {['🏆', '⭐', '🎯', '🔥'].map((emoji, i) => (
                      <div key={i} className="text-4xl p-3 bg-muted rounded-lg">
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showSpriteDialog} onOpenChange={setShowSpriteDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить спрайт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Выбрать из галереи</Label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {spriteGallery.map((sprite) => (
                  <Card
                    key={sprite.id}
                    className="p-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all text-center"
                    onClick={() => addSpriteFromGallery(sprite)}
                  >
                    <div className="text-4xl mb-2">{sprite.emoji}</div>
                    <p className="text-xs font-medium">{sprite.name}</p>
                  </Card>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <Label>Загрузить свое изображение</Label>
              <Input
                ref={spriteImageRef}
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={handleSpriteImageUpload}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBackgroundDialog} onOpenChange={setShowBackgroundDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Выбрать фон</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {backgroundGallery.map((bg) => (
              <Card
                key={bg.id}
                className="cursor-pointer hover:ring-2 hover:ring-primary transition-all overflow-hidden"
                onClick={() => selectBackground(bg)}
              >
                <div className={`h-32 bg-gradient-to-br ${bg.gradient} flex items-center justify-center`}>
                  <p className="text-white font-semibold text-lg drop-shadow-lg">{bg.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSoundDialog} onOpenChange={setShowSoundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить звук</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Загрузить MP3 файл</Label>
              <Input
                ref={soundInputRef}
                type="file"
                accept="audio/mp3,audio/mpeg,audio/wav"
                className="mt-2"
                onChange={handleSoundUpload}
              />
              <p className="text-xs text-muted-foreground mt-1">Поддерживаются форматы: MP3, WAV</p>
            </div>
            {sounds.length > 0 && (
              <>
                <Separator />
                <div>
                  <Label>Мои звуки</Label>
                  <div className="space-y-2 mt-2">
                    {sounds.map((sound) => (
                      <Card key={sound.id} className="p-3">
                        <div className="flex items-center gap-3">
                          <Icon name="Music" size={20} className="text-primary" />
                          <p className="flex-1 text-sm font-medium">{sound.name}</p>
                          <Button size="sm" variant="outline">
                            <Icon name="Play" size={14} />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;