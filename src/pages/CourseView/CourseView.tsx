import { useState } from "react";
import { ChevronRight, ArrowRight, Bell, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button/button";
import { Progress } from "@/components/Progress/Progress";
import styles from "./CourseView.module.css";

type ViewMode = "outline" | "map";

interface Lesson {
  id: number;
  title: string;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

const CourseView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("outline");
  const [selectedModuleId, setSelectedModuleId] = useState(1);

  const courseData = {
    title: "Продвинутый Node.js: Масштабируемые Приложения",
    modulesCount: 7,
    lessonsCount: 42,
    progress: 0,
    modules: [
      {
        id: 1,
        title: "Продвинутые Асинхронные Паттерны",
        lessons: [
          { id: 1, title: "Понимание Event Loop в деталях", completed: false },
          { id: 2, title: "Освоение Promises: Продвинутое Использование", completed: false },
          { id: 3, title: "Использование Async/Await для Сложной Логики", completed: true },
          { id: 4, title: "Реализация Потоков для Эффективной Обработки Данных", completed: false },
          { id: 5, title: "Продвинутая Обработка Ошибок в Асинхронных Операциях", completed: false },
          { id: 6, title: "Практика: Создание Real-Time Pipeline Обработки Данных со Streams", completed: false },
        ],
      },
      {
        id: 2,
        title: "Архитектура Микросервисов с Node.js",
        lessons: [
          { id: 1, title: "Введение в Принципы и Преимущества Микросервисов", completed: false },
          { id: 2, title: "Проектирование Микросервисов: Domain-Driven Design (DDD)", completed: false },
          { id: 3, title: "Реализация Межсервисной Коммуникации: REST vs. gRPC", completed: false },
        ],
      },
    ],
  };

  const selectedModule = courseData.modules.find((m) => m.id === selectedModuleId) || courseData.modules[0];

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l) => l.completed).length;
    const total = module.lessons.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };
  return (
    <div className={styles.root}>
      {/* Global Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.navLink}>Генератор Курсов</Link>

          <div className={styles.headerUtility}>
            <span className={styles.metaText}>{courseData.progress}% / 100% дневного лимита</span>
            <Button variant="ghost" size="icon"><Bell className={styles.iconSmall} /></Button>
            <Button variant="default" size="sm">Улучшить</Button>
          </div>
        </div>
      </header>

      <div className={styles.pageInner}>
        <div className={styles.layoutGrid}>
          {/* Main Content - LEFT (wider) */}
          <main className={styles.main}>
            <div className={styles.card}>
              {/* Module Title */}
              <h1 className={styles.pageTitle}>Модуль {selectedModule.id}: {selectedModule.title}</h1>

              {/* Lesson List */}
              <div className={styles.lessonsList}>
                {selectedModule.lessons.map((lesson) => (
                  <div key={lesson.id} className={styles.lessonRow}>
                    <div className={styles.lessonLeft}>
                      {lesson.completed ? (
                        <div className={`${styles.lessonStatus} ${styles.completed}`}><Check className={styles.iconSmall} /></div>
                      ) : (
                        <div className={`${styles.lessonStatus} ${styles.number}`}>{lesson.id}</div>
                      )}

                      <span className={`${styles.lessonTitle} ${lesson.completed ? styles.muted : ''}`}>{lesson.title}</span>
                    </div>

                    {lesson.completed ? (
                      <span className={styles.lessonCompleted}>Завершено</span>
                    ) : (
                      <button className={styles.startButton}>Начать<ArrowRight className={styles.iconSmall} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar - RIGHT (narrower) */}
          <aside className={styles.aside}>
            <div className={styles.card}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>{courseData.title}</h3>
                <p className={styles.sidebarMeta}>{courseData.modulesCount} модулей • {courseData.lessonsCount} урока</p>

                <div className={styles.sidebarProgress}>
                  <div className={styles.progressLabel}>Прогресс</div>
                  <div className={styles.progressValue}>{courseData.progress}% Завершено</div>
                  <Progress value={courseData.progress} className={styles.progressBar} />
                </div>
              </div>

              <div className={styles.viewToggle}>
                <button onClick={() => setViewMode("outline")} className={`${styles.toggleBtn} ${viewMode === "outline" ? styles.active : ''}`}>План</button>
                <button onClick={() => setViewMode("map")} className={`${styles.toggleBtn} ${viewMode === "map" ? styles.active : ''}`}>Карта</button>
              </div>

              <div className={styles.modulesList}>
                {courseData.modules.map((module) => {
                  const progress = getModuleProgress(module);
                  const isActive = module.id === selectedModuleId;

                  return (
                    <button key={module.id} onClick={() => setSelectedModuleId(module.id)} className={`${styles.moduleRow} ${isActive ? styles.active : ''}`}>
                      <div className={styles.moduleLeft}>
                        <span className={`${styles.moduleBadge} ${isActive ? styles.active : ''}`}>{module.id}</span>
                        <span className={styles.moduleTitle}>{module.title}</span>
                      </div>
                      <ChevronRight className={styles.chev} />

                      <div className={styles.moduleProgress}>
                        <div className={styles.moduleMeta}>{progress.completed} / {progress.total} уроков</div>
                        <Progress value={progress.percentage} className={styles.progressBar} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
export default CourseView;
