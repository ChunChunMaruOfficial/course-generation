import { useEffect, useRef, useState } from "react";
import styles from './ModulePage.module.scss'
import { Card } from "@/trash/components/Card/Card";
import Header from "@/trash/components/Header/header";
import parse from 'html-react-parser';
import { Button } from "@/trash/components/Button/button";
import { useSelector, useDispatch } from "react-redux";
import type { Lesson } from "@/interfaces/Lesson";
import type { Module } from "@/interfaces/Module";
import axios from "axios";
import { selectasimp, setactivelessoncontent, setactivelesson, setactivelessonlinks, setlessonstatus, addselectedword } from '../../slices/answerSlice'
import { useNavigate, useSearchParams } from "react-router-dom";
import loading from '../../assets/loading.gif'
import { type RootState } from "@/store";
import type { Link } from "../../interfaces/Link";
import arrowlink from '../../assets/svg/arrowlink.svg'
import type { CourseData } from "../../interfaces/CourseData";
import type { Practiceoption } from "@/interfaces/Practiceoption";
import type { Practicequestion } from "@/interfaces/Practicequestion";
import like from '../../assets/svg/like.svg'
import dislike from '../../assets/svg/dislike.svg'
import remakecourse from '../../assets/svg/remake.svg'

export default function ModulePage() {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const storecourse = useSelector<RootState, CourseData[]>((state) => state.answer.courses);
    const activecourse = useSelector<RootState, CourseData>((state) => state.answer.activecourse);
    const activemoduleid = useSelector<RootState, number>((state) => state.answer.activemoduleid);
    const activelessonid = useSelector<RootState, number>((state) => state.answer.activelessonid);
    const [rightanswers, setrightanswers] = useState<number | undefined>(undefined)
    const [selectedText, setSelectedText] = useState<string>('');
    const [isLoading, setisLoading] = useState<boolean>(true)
    const [practicetext, setpracticetext] = useState<Practicequestion[]>([]);
    const [showmenu, setShowMenu] = useState<boolean>(false);
    const [ispractice, setispractice] = useState<boolean>(false);
    const [sidebarispened, setsidebarispened] = useState<boolean | null>(null);
    const [Answers, setAnswers] = useState<(Practiceoption[] | undefined)[]>(
        Array.from({ length: practicetext.length }, () => [])
    );
    const [activeTab, setActiveTab] = useState("tab-1");
    const cardRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const menubuttonRef = useRef<HTMLImageElement>(null)
    const QuestionRefs = useRef<(HTMLDivElement | null)[]>([])
    const tabsData = [
        {
            id: "tab-1", label: "RoadMap", content: activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == activelessonid)!.selectedwords
        },
        {
            id: "tab-2", label: "Notes", content: []
        }
    ];


    async function Getexplanation(target: string) {
        const response = await axios.post('http://localhost:3000/api/generateexplanation',
            { topic: target, moduleid: activemoduleid, courseid: activecourse.id, lessonid: activelessonid },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        dispatch(addselectedword(`${target} - ${response.data.result}`))
    }

    async function GetCourse() {
        console.log('GENERATING LESSON');
        setisLoading(true)
        const response = await axios.post('http://localhost:3000/api/generateLesson',
            { topic: decodeURIComponent(searchParams.get('theme')!), course_structure: JSON.stringify(activecourse), context: '', moduleid: activemoduleid, courseid: activecourse.id, lessonid: activelessonid },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data.result);

        dispatch(setactivelessoncontent(response.data.result.lesson_text))
        dispatch(setactivelessonlinks(response.data.result.links))
        setisLoading(false)
    }

    useEffect(() => {
        if (storecourse.length > 0 && activecourse!.modules.find(v => v.id === activemoduleid)!.lessons.find(v => v.id === activelessonid)!.content == '') {
            GetCourse()
        } else if (storecourse.length > 0) {
            setisLoading(false)
        }

        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (selection) {
                setSelectedText(selection.toString());
            }
        };

        const handleMouseUp = (event: any) => {
            const selection = window.getSelection();
            if (!selection || selection.toString() === '') {
                console.log('Выделение снято');
                setShowMenu(false)
            } else {
                console.log('Выделенный текст:', selection.toString());
                if (menuRef.current) {
                    menuRef.current.style.left = `${event.pageX}px`;
                    menuRef.current.style.top = `${event.pageY + 15}px`
                }
                setShowMenu(true)
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const mixpractice = () => {

        setpracticetext((prev: any) => {
            const shuffleArray = (arr: any) => {
                const arrayCopy = [...arr];
                for (let i = arrayCopy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
                }
                return arrayCopy;
            };

            const withShuffledOptions = prev.map((item: any) => ({
                ...item,
                options: Array.isArray(item.options) ? shuffleArray(item.options) : item.options,
            }));

            return shuffleArray(withShuffledOptions);
        });

    }

    async function getpractice() {
        setispractice(true)
        setisLoading(true)

        if (storecourse.length > 0 && activecourse!.modules.find(v => v.id === activemoduleid)!.lessons.find(v => v.id === activelessonid)!.practice.length == 0) {
            const response = await axios.post('http://localhost:3000/api/generatePractice',
                { topic: activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == activelessonid)!.content, highlights: JSON.stringify(activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == activelessonid)!.selectedwords), moduleid: activemoduleid, courseid: activecourse.id, lessonid: activelessonid, previous_practice: '' },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setpracticetext(response.data.result.questions)
            setisLoading(false)
            mixpractice()

        } else if (storecourse.length > 0) {
            setpracticetext(activecourse!.modules.find(v => v.id === activemoduleid)!.lessons.find(v => v.id === activelessonid)!.practice)
            setisLoading(false)
        }


    }

    const rightcheck = () => {

        if (practicetext.length > 0 && (Answers.some(v => v != undefined && v.length == 0) || Answers.includes(undefined))) {
            const idx = Answers.findIndex((v: Practiceoption[] | undefined) => v == undefined || v.length < 1)
            const element = QuestionRefs.current[idx];

            element!.scrollIntoView({ behavior: 'smooth' });
            element!.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            setTimeout(() => {
                element!.style.backgroundColor = 'transparent';
            }, 2000);

            return 0;
        }

        setrightanswers(() => {
            const result = Answers.flat().filter(v => v?.correct === true);
            return result.length;
        });
    }

    function getnewtheory() {

        window.scrollTo({ top: 0, behavior: 'smooth' })
        const nextLessonId = activelessonid + 1;
        dispatch(setactivelesson(nextLessonId))
        setispractice(false)
        setrightanswers(undefined)
        navigate(`../theory?theme=${encodeURIComponent(activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == nextLessonId)!.title)}`)
        GetCourse()
    }

    return (
        <div onClick={(e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && menubuttonRef.current && !menubuttonRef.current.contains(e.target as Node)) {
                setsidebarispened((prev) => (prev === true ? false : null));
            }
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setShowMenu(false)
            }
        }}>
            <Header setisLoading={setisLoading} sidebarispened={sidebarispened} sidebarRef={sidebarRef} menubuttonRef={menubuttonRef} setsidebarispened={setsidebarispened}></Header>
            <div className={styles.parent}>
                <Card ref={cardRef} className={styles.container}>
                    <h1>{decodeURIComponent(searchParams.get('theme')!)}</h1>

                    {isLoading ? (<img src={loading} className={styles.loadgif} />) : (!ispractice ? (<div className={styles.theory}>
                        {activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == activelessonid)!.content && parse(activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == activelessonid)!.content)}
                        <div className={styles.bottompanel}>
                            <div className={styles.leftside}>
                                <img onClick={() => dispatch(setlessonstatus(2))} title="нравится" src={like} alt="" />
                                <img onClick={() => dispatch(setlessonstatus(1))} title="не нравится" src={dislike} alt="" />
                            </div>
                            <img title="сгенерировать урок заново" src={remakecourse} alt="" />
                        </div>
                    </div>) : (
                        <div className={styles.questionContainer}>{practicetext.map((v: Practicequestion, i: number) => (<div ref={el => { QuestionRefs.current[i] = el }} key={i}><h1 >{parse(v.question)}</h1>
                            <span>{v.options.map((v1: Practiceoption, i1: number) => (<div key={i1}>
                                <input
                                    type="checkbox"
                                    id={`${i}-${i1}`}
                                    checked={Answers[i]?.includes(v1) ?? false}
                                    onChange={() => {
                                        setAnswers(a => {
                                            const newAnswers = [...a];
                                            const current = newAnswers[i] ? [...newAnswers[i]] : [];
                                            if (current.indexOf(v1) === -1) {
                                                current.push(v1);
                                            } else {
                                                current.splice(current.indexOf(v1), 1);
                                            }
                                            newAnswers[i] = current;
                                            return newAnswers;
                                        });
                                    }}
                                    name={`${v.id}-${i1}`}
                                />
                                <label
                                    style={{ color: v1.correct ? 'red' : '' }}
                                    className={`${styles.customradio} ${styles.label}`}
                                    htmlFor={`${i}-${i1}`}
                                >
                                    {parse(v1.text)}
                                </label>
                            </div>))}</span>
                        </div>))}</div>
                    ))}
                    {!isLoading && !ispractice && (<><h2>Связанные</h2>
                        <div className={styles.materials}>{activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == activelessonid)!.links.map((v: Link, i: number) => (<a key={i} target="_blank" href={v.url}><img src={arrowlink} /><p>{v.description}</p></a>))}</div></>)}
                    {!isLoading && rightanswers == undefined && (<Button onClick={() => { ispractice ? rightcheck() : (getpractice(), window.scrollTo({ top: 0, behavior: 'smooth' })) }} >{ispractice ? 'Проверить тест' : 'Перейти к тесту'}</Button>)}
                    {rightanswers != undefined && (<div className={styles.rightcheck}><Button onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setrightanswers(undefined);
                        mixpractice()
                    }}>Пройти тест заново</Button> <p>{rightanswers}/{practicetext.length}</p> <Button onClick={() => getnewtheory()}>Перейти к следующему уроку</Button></div>)}
                </Card>

                <div className={styles.folder}>
                    <div className={styles.tabs}>
                        {tabsData.map(({ id, label }) => (
                            <button
                                key={id}
                                className={`${styles.tab} ${activeTab === id ? styles.active : ""}`}
                                onClick={() => setActiveTab(id)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.content}>
                        {activeTab == "tab-1" ? storecourse.length > 0 ? activecourse!.modules.map((v: Module, i: number) => (
                            <div className={styles.roadmapitem} key={i}>
                                <div className={styles.leftpart}><p>{v.title}</p>
                                    <span>{v.lessons.map((v1: Lesson, i) => (<p style={{ textDecoration: v1.id == activelessonid && v.id == activemoduleid ? 'underline' : '' }} key={i}>{v1.title}</p>))}</span>
                                </div>
                                <div className={styles.rightpart}>
                                    <hr />
                                    <span></span>
                                    <hr />
                                </div>
                            </div>
                        )) : (<div className={styles.sorrymessage}><h2>У вас пока что нет курсов 😓</h2><Button onClick={() => navigate("../")}>Сгенерировать курс</Button></div>) : activecourse!.modules.find(v => v.id == activemoduleid)!.lessons.find(v => v.id == activelessonid)!.selectedwords.map((v, i) => (<p key={i}>{v}</p>))}
                    </div>
                </div>
                <div style={{ opacity: showmenu ? '1' : '0' }} ref={menuRef} className={styles.minimenu}><button onClick={() => { dispatch(selectasimp(selectedText)); setShowMenu(false) }}>Выделить как важное</button> <button onClick={() => { Getexplanation(selectedText); setShowMenu(false) }}>объяснить</button></div>
            </div>

        </div>
    );
}
