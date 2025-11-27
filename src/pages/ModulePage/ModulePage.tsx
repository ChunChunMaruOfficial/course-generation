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
import { selectasimp, setactivelessoncontent, setactivelesson, setactivelessonlinks } from '../../slices/answerSlice'
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
    const activemodule = useSelector<RootState, number>((state) => state.answer.activemodule);
    const activelesson = useSelector<RootState, number>((state) => state.answer.activelesson);
    const [selectedwords, setselectedwords] = useState<string[]>([])
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
            id: "tab-1", label: "RoadMap", content: selectedwords
        },
        {
            id: "tab-2", label: "Notes", content: []
        }
    ];


    async function Getexplanation() {
        const target = selectedText
        const response = await axios.post('http://localhost:3000/api/generateexplanation',
            { topic: selectedText },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        setselectedwords(words =>
            words.map(str =>
                str === target ? `${str} - ${response.data.result}` : str
            )
        );

    }

    async function GetCourse() {
        console.log('GENERATING LESSON');
        setisLoading(true)
        const response = await axios.post('http://localhost:3000/api/generateLesson',
            { topic: decodeURIComponent(searchParams.get('theme')!), course_structure: JSON.stringify(activecourse), context: '' },
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

        (storecourse.length > 0 && !activecourse!.modules[activemodule].lessons[activelesson].content) && GetCourse()

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
                    menuRef.current.style.left = `${event.clientX}px`;
                    menuRef.current.style.top = `${event.clientY + 15}px`
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

    async function getpractice() {
        setispractice(true)
        setisLoading(true)
        const response = await axios.post('http://localhost:3000/api/generatePractice',
            { topic: activecourse!.modules[activemodule].lessons[activelesson].content, highlights: JSON.stringify(selectedwords), previous_practice: '' },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        setpracticetext(response.data.result.questions)
        setisLoading(false)

    }

    const retry = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setrightanswers(undefined)
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
        dispatch(setactivelesson(activelesson + 1))
        setispractice(false)
        setrightanswers(undefined)
        navigate(`../theory?theme=${encodeURIComponent(activecourse!.modules[activemodule].lessons[activelesson + 1].title)}`)
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
            <Header sidebarispened={sidebarispened} sidebarRef={sidebarRef} menubuttonRef={menubuttonRef} setsidebarispened={setsidebarispened}></Header>
            <div className={styles.parent}>
                <Card ref={cardRef} className={styles.container}>
                    <h1>{decodeURIComponent(searchParams.get('theme')!)}</h1>

                    {isLoading ? (<img src={loading} className={styles.loadgif} />) : (!ispractice ? (<div className={styles.theory}>
                        {activecourse!.modules[activemodule].lessons[activelesson].content && parse(activecourse!.modules[activemodule].lessons[activelesson].content)}
                        <span className={styles.bottompanel}>
                            <span className={styles.leftpart}>
                                <img src={like} alt="" /> 
                                <img src={dislike} alt="" />
                            </span>
                            <img src={remakecourse} alt="" />
                        </span>
                    </div>) : (
                        <div className={styles.questionContainer}>{practicetext.map((v: Practicequestion, i: number) => (<div ref={el => { QuestionRefs.current[i] = el }} key={i}><h1 >{parse(v.question)}</h1>
                            <span>{v.options.map((v1: Practiceoption, i1: number) => (<div>
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
                                    {v1.text}
                                </label>
                            </div>))}</span>
                        </div>))}</div>
                    ))}
                    {!isLoading && (<><h2>Связанные</h2>
                        <div className={styles.materials}>{activecourse!.modules[activemodule].lessons[activelesson].links.map((v: Link) => (<a target="_blank" href={v.url}><img src={arrowlink} /><p>{v.description}</p></a>))}</div></>)}
                    {!isLoading && rightanswers == undefined && (<Button onClick={() => { ispractice ? rightcheck() : (getpractice(), window.scrollTo({ top: 0, behavior: 'smooth' })) }} >{ispractice ? 'Проверить тест' : 'Перейти к тесту'}</Button>)}
                    {rightanswers != undefined && (<div className={styles.rightcheck}><Button onClick={() => retry()}>Пройти тест заново</Button> <p>{rightanswers}/{practicetext.length}</p> <Button onClick={() => getnewtheory()}>Перейти к следующему уроку</Button></div>)}
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
                                    <span>{v.lessons.map((v1: Lesson, i) => (<p style={{ textDecoration: v1.id == (activelesson + 1) && v.id == (activemodule + 1) ? 'underline' : '' }} key={i}>{v1.title}</p>))}</span>
                                </div>
                                <div className={styles.rightpart}>
                                    <hr />
                                    <span></span>
                                    <hr />
                                </div>
                            </div>
                        )) : (<div className={styles.sorrymessage}><h2>У вас пока что нет курсов 😓</h2><Button onClick={() => navigate("../")}>Сгенерировать курс</Button></div>) : selectedwords.map((v, i) => (<p key={i}>{v}</p>))}
                    </div>
                </div>
                <div style={{ opacity: showmenu ? '1' : '0' }} ref={menuRef} className={styles.minimenu}><button onClick={() => { dispatch(selectasimp(selectedText)); setShowMenu(false) }}>Выделить как важное</button> <button onClick={() => { Getexplanation(); !selectedwords.includes(selectedText) && setselectedwords(sw => [...sw, selectedText]); setShowMenu(false) }}>объяснить</button></div>
            </div>

        </div>
    );
}
