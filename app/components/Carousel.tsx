import { useState, useEffect, useRef } from "react";

export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  gradient: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

/**
 * 輪播元件
 * 支持自動播放、手動切換、滑動和指示器
 */
export function Carousel({ items, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 自動播放
  useEffect(() => {
    if (!autoPlay || isDragging) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, isDragging]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setDragOffset(0);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setDragOffset(0);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setDragOffset(0);
  };

  // 觸碰事件處理
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setDragOffset(0);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    setDragOffset(offset);
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);
    
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // 滑鼠事件處理（桌面拖拽模擬）
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setDragOffset(0);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - touchStart;
    setDragOffset(offset);
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset(0);
    
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 30;
    const isRightSwipe = distance < -30;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      {/* 輪播容器 */}
      <div
        ref={carouselRef}
        className="relative h-72 bg-surface cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 背景圖層 - 帶有過度動畫 */}
        <div
          className={`absolute inset-0 ${currentItem.gradient} transition-all ${
            isDragging ? "duration-0" : "duration-700"
          } ease-in-out`}
          style={{
            transform: `translateX(${isDragging ? dragOffset * 0.3 : 0}px)`,
          }}
          aria-hidden="true"
        />

        {/* 內容 - 帶有過度動畫 */}
        <div className="relative h-full flex items-center justify-center overflow-hidden">
          <div
            className={`text-center transition-all ${
              isDragging ? "duration-0" : "duration-700"
            } ease-in-out ${!isDragging ? "opacity-100 scale-100" : "opacity-50"}`}
            style={{
              transform: `translateX(${isDragging ? dragOffset * 0.2 : 0}px)`,
            }}
          >
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">
              {currentItem.title}
            </h2>
            <p className="text-white/90 mt-2 drop-shadow">{currentItem.subtitle}</p>
          </div>
        </div>

        {/* 上一頁按鈕 */}
        <button
          onClick={goToPrevious}
          onTouchStart={(e) => e.stopPropagation()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/40 hover:bg-white/60 text-[var(--color-primary)] rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2"
          aria-label="上一張"
        >
          ❮
        </button>

        {/* 下一頁按鈕 */}
        <button
          onClick={goToNext}
          onTouchStart={(e) => e.stopPropagation()}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/40 hover:bg-white/60 text-[var(--color-primary)] rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2"
          aria-label="下一張"
        >
          ❯
        </button>
      </div>

      {/* 指示器 */}
      <div className="flex justify-center gap-2 py-4 bg-surface">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] ${
              index === currentIndex
                ? "bg-[var(--color-rose)] w-8"
                : "bg-[var(--color-border)] w-2 hover:bg-[var(--color-muted)]"
            }`}
            aria-label={`轉到第 ${index + 1} 張`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>

      {/* 計數器 */}
      <div className="text-center text-sm text-muted py-2 bg-surface">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
}
