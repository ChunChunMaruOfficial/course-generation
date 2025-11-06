import { useEffect, useRef, useState } from "react";
import { ChevronRight, ArrowRight, Bell, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button/button";
import { Progress } from "@/components/Progress/Progress";
import { AnimatePresence, motion } from 'framer-motion'
import styles from "./CourseView.module.css";
import { useSelector } from "react-redux";
import type { Module } from "../../interfaces/Module";
import type { Lesson } from "../../interfaces/Lesson";
import type { Theme } from "../../interfaces/Theme";
import type { CourseData } from "../../interfaces/CourseData";
import book from '../../assets/svg/book.svg'
import video from '../../assets/svg/video.svg'
import code from '../../assets/svg/code.svg'
import arrowmore from '../../assets/svg/arrowmore.svg'
import { useDispatch } from 'react-redux';
import { setcourse } from '../../counter/answerSlice'
import menu from '../../assets/svg/menu.svg'
// import Skeleton from 'react-loading-skeleton';

const lessonscontent: Theme[] = [{
  name: 'Создание и вызов функции',
  img: book,
  type: 'Теория'
}, {
  name: 'Стрелочные функции',
  img: video,
  type: 'Источник'
}, {
  name: 'Практика: калькулятор',
  img: code,
  type: 'Практика'
}]

type ViewMode = "outline" | "map";

const pageVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
};

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
  const storecourse = useSelector((state: any) => state.answer.course);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<ViewMode>("outline");
  const [sidebarispened, setsidebarispened] = useState<boolean | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null)
  const menubuttonRef = useRef<HTMLImageElement>(null)
  const [courseId, setcourseId] = useState<number>(0);
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [highlightProps, setHighlightProps] = useState({ left: 0, width: 0 });
  const [isLoading, setisLoading] = useState<boolean>(true)


  useEffect(() => {

    if (!storecourse[0] || !storecourse[0].modules || !storecourse[0].modules.length) {
      async function getcourse() {

        const response = await fetch('http://localhost:3000/courses')
        const data = await response.json()
        console.log(data)
        const parsedCourses = data.result.map((item: string) => {
          const cleaned = item.trim().replace('```', '').replace('json', '').replace('```', '')
          console.log(cleaned);
          return JSON.parse(cleaned);
        });

        dispatch(setcourse(parsedCourses));
      }
      getcourse()
    }
  }, []);

  useEffect(() => { storecourse.length > 0 && setisLoading(false) }, [storecourse])

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
    const completed = module.lessons.filter((l: Lesson) => l.completed).length;
    const total = module.lessons.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };
  return (
    <div onClick={(e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && menubuttonRef.current && !menubuttonRef.current.contains(e.target as Node)) {
        setsidebarispened((prev) => (prev === true ? false : null));
      }
    }} className={styles.root}>
      <div ref={sidebarRef} className={`${styles.sidebar} ${sidebarispened ? styles.sidebaropen : sidebarispened === false ? styles.sidebarclosed : ''}`}>
        <h2 className={styles.pageTitle}>Мои курсы</h2>
        {storecourse.map((v: CourseData, i: number) => (
          <p key={i} onClick={() => { setcourseId(i); setsidebarispened(false); }}>{v.title}</p>))}
      </div>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <img ref={menubuttonRef} onClick={() => setsidebarispened(true)} src={menu} alt="" />
            <Link to="/" className={styles.navLink}>SelfSpark</Link>
          </div>
          <div className={styles.headerUtility}>
            {/* <span className={styles.metaText}>{course.progress}% / 100% дневного лимита</span> */}
            <Button variant="ghost" size="icon"><Bell className={styles.iconSmall} /></Button>
            <Button variant="default" size="sm">Улучшить</Button>
          </div>
        </div>
      </header>

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

              <h1 className={styles.pageTitle}>Модуль {storecourse[courseId].modules[selectedModuleId].id}: {storecourse[courseId].modules[selectedModuleId].title} </h1>

              <div className={styles.lessonsList}>
                {storecourse[courseId].modules[selectedModuleId].lessons.map((lesson: Lesson) => (
                  <div className={styles.lessonItem}
                    style={{ boxShadow: expandedLessonId === lesson.id ? '0 4px 10px rgba(0, 0, 0, 0.15)' : '' }}
                    onClick={() => {
                      setExpandedLessonId((prev) =>
                        prev === lesson.id ? null : lesson.id
                      )
                      console.log(expandedLessonId);

                    }


                    }
                    key={lesson.id}>
                    <div key={lesson.id} className={styles.lessonRow}>
                      <div className={styles.lessonLeft}>
                        {lesson.completed ? (
                          <div className={`${styles.lessonStatus} ${styles.completed}`}><Check className={styles.iconSmall} /></div>
                        ) : (
                          <div className={`${styles.lessonStatus} ${styles.number}`}>{lesson.id}</div>
                        )}

                        <span className={`${styles.lessonTitle} ${lesson.completed ? styles.muted : ''}`}>{lesson.title}</span>
                      </div>

                      {expandedLessonId === lesson.id ? (<motion.p

                        variants={pageVariants}
                        initial={'initial'}
                        animate={'animate'}
                        exit={'exit'}
                        className={styles.lessonProgress + " " + styles.progressValue}>0/{lessonscontent.length}</motion.p>) : lesson.completed ? (
                          <motion.span
                            variants={pageVariants}
                            initial={'initial'}
                            animate={'animate'}
                            exit={'exit'}
                            className={styles.lessonCompleted}>Завершено</motion.span>
                        ) : (
                        <motion.button
                          variants={pageVariants}
                          initial={'initial'}
                          animate={'animate'}
                          exit={'exit'}
                          className={styles.startButton}>Начать<ArrowRight className={styles.iconSmall} /></motion.button>
                      )
                      }

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
                          <p className={styles.sidebarMeta}>Здесь типо можно описание вставить</p>

                          <div
                            className={styles.themeList}>
                            {lessonscontent.map((v, i) => (
                              <div
                                className={styles.theme}
                                key={i}>
                                <div className={styles.left}>
                                  <div className={styles.complete} />
                                  <p className={styles.sidebarMeta}>1.{i + 1}</p>
                                  <p className={styles.progressValue}>{v.name}</p>
                                </div>
                                <div className={styles.right}>
                                  <p className={styles.progressValue}><img src={v.img} alt="" />{v.type}</p>
                                  <img src={arrowmore} alt="" />
                                </div>
                              </div>
                            ))}
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </main>

          <aside className={styles.aside}>
            <div className={styles.card}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>{storecourse[courseId].title}</h3>
                <p className={styles.sidebarMeta}>{storecourse[courseId].modulesCount} модулей • {storecourse[courseId].lessonsCount} урока</p>

                <div className={styles.sidebarProgress}>
                  <div className={styles.progressLabel}>Прогресс</div>
                  <div className={styles.progressValue}>{storecourse[courseId].progress}% Завершено</div>
                  <Progress value={storecourse[courseId].progress} className={styles.progressBar} />
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
                {storecourse[courseId].modules.map((module: Module) => {
                  const progress = getModuleProgress(module);
                  const isActive = module.id === (selectedModuleId + 1);

                  return (
                    <button key={module.id} onClick={() => { setSelectedModuleId(module.id - 1); setExpandedLessonId(null) }} className={`${styles.moduleRow} ${isActive ? styles.active : ''}`}>
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
          {/* <section className="user-card">
            <div className="user-avatar">
              {!isLoading && <Skeleton circle={true} height={80} width={80} />}
            </div>
            <h3 className="user-name">
              {!isLoading && <Skeleton width={120} />}
            </h3>
            <p className="user-info">
              {!isLoading && <Skeleton count={3} /> }
            </p>
          </section> */}
        </div>
      </div>
    )}
      {/* {!isLoading && (<Skeleton count={3} />)} */}
    </div>
  );
};
export default CourseView;