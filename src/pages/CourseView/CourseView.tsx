import { useEffect, useRef, useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { Progress } from "@/trash/components/Progress/Progress";
import { AnimatePresence, motion } from 'framer-motion'
import styles from "./CourseView.module.scss";
import { useSelector, useDispatch } from "react-redux";
import type { Module } from "../../interfaces/Module";
import type { Lesson } from "../../interfaces/Lesson";
import type { Theme } from "../../interfaces/Theme";
import book from '../../assets/svg/book.svg'
import code from '../../assets/svg/code.svg'
import { setactivemodule, setactivelesson } from '../../slices/answerSlice'
import Header from "@/trash/components/Header/header";
import { useNavigate } from "react-router-dom";
import type { CourseData } from "@/interfaces/CourseData";
import type { RootState } from "@/store";


const lessonscontent: Theme[] = [{
  img: book,
  type: 'Теория'
}, {

  img: code,
  type: 'Практика'
}]

type ViewMode = "outline" | "map";

const cardVariants = {
  initial: {
    opacity: 0,
    transform: 'translateX(-15px)'
  },
  animate: {
    opacity: 1,
    transform: 'none'
  },
  exit: {
    opacity: 0,
    transform: 'translateX(15px)'
  }
}

const CourseView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const storecourse = useSelector<RootState, CourseData[]>((state) => state.answer.courses);
  const activecourse = useSelector<RootState, CourseData>((state) => state.answer.activecourse);
  const activemodule = useSelector<RootState, number>((state) => state.answer.activemoduleid);
  const [viewMode, setViewMode] = useState<ViewMode>("outline");
  const [sidebarispened, setsidebarispened] = useState<boolean | null>(null);
  const [highlightProps, setHighlightProps] = useState({ left: 0, width: 0 });
  const [isLoading, setisLoading] = useState<boolean>(true)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const menubuttonRef = useRef<HTMLImageElement>(null)
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    storecourse.length > 0 && setisLoading(false); console.log(storecourse);
  }, [storecourse])

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

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l: Lesson) => l.theorycompl == 100).length;
    const total = module.lessons.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  return (
    <div onClick={(e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && menubuttonRef.current && !menubuttonRef.current.contains(e.target as Node)) {
        setsidebarispened((prev) => (prev === true ? false : null));
      }
    }} className={styles.root}>
      <Header isLoading={isLoading} sidebarispened={sidebarispened} sidebarRef={sidebarRef} menubuttonRef={menubuttonRef} setsidebarispened={setsidebarispened}></Header>

      {!isLoading && (<div className={styles.pageInner}>
        <div className={styles.layoutGrid}>
          <main className={styles.main}>
            <motion.div className={styles.card}
              variants={cardVariants}
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              transition={{ duration: .5 }}
            >

              <h1 className={styles.pageTitle}>{activemodule}. {activecourse.modules.find(v => v.id == activemodule)!.title} </h1>

              <div className={styles.lessonsList}>
                {activecourse.modules.find(v => v.id == activemodule)!.lessons.map((lesson: Lesson, id: number) => (
                  <div className={styles.lessonItem} key={id}
                    style={{ boxShadow: expandedLessonId === lesson.id ? '0 4px 10px rgba(0, 0, 0, 0.15)' : '' }}
                    onClick={() => {
                      setExpandedLessonId((prev) =>
                        prev === lesson.id ? null : lesson.id)
                      console.log(expandedLessonId);
                    }}
                  >
                    <div key={lesson.id} className={styles.lessonRow}>
                      <div className={styles.lessonLeft}>
                        {lesson.practicecompl == 100 && lesson.theorycompl == 100 ? (
                          <div className={`${styles.lessonStatus} ${styles.completed}`}><Check className={styles.iconSmall} /></div>
                        ) : (
                          <div className={`${styles.lessonStatus} ${styles.number}`}>{lesson.id}</div>
                        )}

                        <span className={`${styles.lessonTitle} ${lesson.theorycompl == 100 ? styles.muted : ''}`}>{lesson.title}</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedLessonId === lesson.id && (
                        <motion.div
                          initial={{
                            height: 0
                          }}
                          animate={{
                            height: 'auto'
                          }}
                          exit={{
                            height: 0
                          }}
                          transition={{ duration: .3 }}
                          className={styles.lessonMeta}>

                          <div
                            className={styles.themeList}>
                            {lessonscontent.map((v, i) => (

                              <div key={i} onClick={() => i == 0 ? (navigate(`../theory?theme=${encodeURIComponent(lesson.title)}`), dispatch(setactivelesson(lesson.id))) : navigate(`./practice?theme=${encodeURIComponent(lesson.title)}`)} className={styles.right}>
                                <p className={styles.progressValue}><img src={v.img} alt="" />{v.type}</p>
                              </div>

                            ))}
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span style={{ width: `${lesson.theorycompl}%` }} className={styles.theoryprogress}></span>
                    <span style={{ width: `${lesson.practicecompl}%` }} className={styles.practiceprogress}></span>
                  </div>
                ))}
              </div>
            </motion.div>
          </main>

          <aside className={styles.aside}>
            <div className={styles.card}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>{activecourse.title}</h3>
                <p className={styles.sidebarMeta}>{activecourse.modules.length} модулей • {activecourse.lessonsCount} урока</p>

                <div className={styles.sidebarProgress}>
                  <div className={styles.progressLabel}>Прогресс</div>
                  <div className={styles.progressValue}>{activecourse.progress}% Завершено</div>
                  <Progress value={activecourse.progress} className={styles.progressBar} />
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
                {activecourse.modules.map((module: Module) => {
                  const progress = getModuleProgress(module);
                  const isActive = module.id === activemodule;

                  return (
                    <button key={module.id} onClick={() => { dispatch(setactivemodule(module.id)); setExpandedLessonId(null) }} className={`${styles.moduleRow} ${isActive ? styles.active : ''}`}>
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
      )}
    </div>
  );
};
export default CourseView;