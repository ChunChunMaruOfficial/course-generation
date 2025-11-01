import { useEffect, useRef, useState } from "react";
import { ChevronRight, ArrowRight, Bell, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button/button";
import { Progress } from "@/components/Progress/Progress";
import { motion } from 'framer-motion'
import styles from "./CourseView.module.css";
import { useSelector } from "react-redux";
import type { Module } from "../../interfaces/Module";
import type { Lesson } from "../../interfaces/Lesson";
type ViewMode = "outline" | "map";


const CourseView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("outline");
  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const course = useSelector((state: any) => state.answer.course);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [highlightProps, setHighlightProps] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const activeIndex = viewMode === "outline" ? 0 : 1;
    if (!container) return;

    const child = container.children[activeIndex] as HTMLElement | undefined;
    if (child) {
      const { offsetLeft, offsetWidth } = child;
      setHighlightProps({ left: offsetLeft + 3, width: offsetWidth });
    }
  }, [viewMode]);

  const selectedModule = course.modules.find((m: Module) => m.id === selectedModuleId) || course.modules[0];

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l: Lesson) => l.completed).length;
    const total = module.lessons.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.navLink}>Генератор Курсов</Link>

          <div className={styles.headerUtility}>
            <span className={styles.metaText}>{course.progress}% / 100% дневного лимита</span>
            <Button variant="ghost" size="icon"><Bell className={styles.iconSmall} /></Button>
            <Button variant="default" size="sm">Улучшить</Button>
          </div>
        </div>
      </header>

      <div className={styles.pageInner}>
        <div className={styles.layoutGrid}>
          <main className={styles.main}>
            <div className={styles.card}>
              <h1 className={styles.pageTitle}>Модуль {selectedModule.id}: {selectedModule.title}</h1>

              <div className={styles.lessonsList}>
                {selectedModule.lessons.map((lesson: Lesson) => (
                  <div className={styles.lessonItem} key={lesson.id}>
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
                    <div className={styles.lessonMeta}>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className={styles.aside}>
            <div className={styles.card}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>{course.title}</h3>
                <p className={styles.sidebarMeta}>{course.modulesCount} модулей • {course.lessonsCount} урока</p>

                <div className={styles.sidebarProgress}>
                  <div className={styles.progressLabel}>Прогресс</div>
                  <div className={styles.progressValue}>{course.progress}% Завершено</div>
                  <Progress value={course.progress} className={styles.progressBar} />
                </div>
              </div>



              <div className={styles.viewToggle} style={{ position: "relative" }}>
                <motion.div
                  style={{
                    position: "absolute",
                    top: '10%',
                    left: highlightProps.left,
                    width: highlightProps.width,
                    height: "80%",
                    backgroundColor: "var(--primary-light)",
                    borderRadius: "10px",
                    zIndex: 0,
                  }}
                  animate={{ left: highlightProps.left, width: highlightProps.width }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <div ref={containerRef} style={{ position: "relative", zIndex: 1, display: "flex", width: '100%' }}>
                  <button
                    onClick={() => setViewMode("outline")}
                    className={styles.toggleBtn}
                    style={{ color: viewMode == 'outline' ? 'var(--primary)' : '' }}
                  >
                    План
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={styles.toggleBtn}
                    style={{ color: viewMode == 'map' ? 'var(--primary)' : '' }}
                  >
                    Карта
                  </button>
                </div>
              </div>

              <div className={styles.modulesList}>
                {course.modules.map((module: Module) => {
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
