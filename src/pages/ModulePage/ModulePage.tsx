import { useEffect, useMemo, useRef, useState } from "react";
import styles from './ModulePage.module.scss'
import { Card } from "@/trash/components/Card/Card";
import Header from "@/trash/components/Header/header";
import parse from 'html-react-parser';
import { Button } from "@/trash/components/Button/button";
import { useSelector, useDispatch } from "react-redux";
import type { Lesson } from "@/interfaces/Lesson";
import type { Module } from "@/interfaces/Module";
import axios from "axios";
import { selectasimp, setactivelessoncontent, setactivelesson } from '../../slices/answerSlice'
import { useNavigate, useSearchParams } from "react-router-dom";
import loading from '../../assets/loading.gif'



export default function ModulePage() {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const storecourse = useSelector((state: any) => state.answer.course);
    const activecourse = useSelector((state: any) => state.answer.activecourse);
    const activemodule = useSelector((state: any) => state.answer.activemodule);
    const activelesson = useSelector((state: any) => state.answer.activelesson);
    const [selectedwords, setselectedwords] = useState<string[]>([])
    const [rightanswers, setrightanswers] = useState<number | undefined>(undefined)
    const [selectedText, setSelectedText] = useState<string>('');
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [practicetext, setpracticetext] = useState<any>([]);
    const [showmenu, setShowMenu] = useState<boolean>(false);
    const [ispractice, setispractice] = useState<boolean>(false);
    const [sidebarispened, setsidebarispened] = useState<boolean | null>(null);
    const [Answers, setAnswers] = useState<(number[] | undefined)[]>(
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
            { topic: decodeURIComponent(searchParams.get('theme')!) },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        dispatch(setactivelessoncontent(JSON.parse(JSON.stringify(response.data.result).replace('json', '').replaceAll('`', '')).lesson_text))
        setisLoading(false)
    }

    useEffect(() => {

        (storecourse && !storecourse[activecourse].modules[activemodule].lessons[activelesson].content) && GetCourse()

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
            { topic: decodeURIComponent(searchParams.get('theme')!) },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        setpracticetext(response.data.result.questions)
        setisLoading(false)

    }

    function getnewtheory() {

        if (practicetext.length > 0 && (Answers.some(v => v != undefined && v.length == 0) || Answers.includes(undefined))) {
            const idx = Answers.findIndex((v: any) => v == undefined || v.length < 1)
            const element = QuestionRefs.current[idx];

            element!.scrollIntoView({ behavior: 'smooth' });
            element!.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            setTimeout(() => {
                element!.style.backgroundColor = 'transparent';
            }, 2000);

            return 0;
        }

        //setrightanswers(Answers.filter(v => v!.correct == true).length)


        // dispatch(setactivelesson(activelesson + 1))
        // navigate(`../theory?theme=${encodeURIComponent(storecourse[activecourse].modules[activemodule].lessons[activelesson + 1].title)}`)
        // setispractice(false)
        // GetCourse()
    }

    console.log(practicetext);


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
                        {storecourse[activecourse].modules[activemodule].lessons[activelesson].content && parse(storecourse[activecourse].modules[activemodule].lessons[activelesson].content)}

                    </div>) : (
                        <div className={styles.questionContainer}>{practicetext.map((v: any, i: number) => (<div ref={el => { QuestionRefs.current[i] = el }} key={i}><h1 >{parse(v.question)}</h1>
                            <span>{v.options.map((v1: any, i1: number) => (<div>
                                <input
                                    type="checkbox"
                                    id={`${i}-${i1}`}
                                    checked={Answers[i]?.includes(i1) ?? false}
                                    onChange={() => {

                                        setAnswers(a => {
                                            const newAnswers = [...a];
                                            const current = newAnswers[i] ? [...newAnswers[i]] : [];
                                            if (current.indexOf(i1) === -1) {
                                                current.push(i1);
                                            } else {
                                                current.splice(current.indexOf(i1), 1);
                                            }
                                            newAnswers[i] = current;
                                            return newAnswers;
                                        });

                                    }}
                                    name={`${v.id}-${i1}`}
                                />
                                <label
                                    className={`${styles.customradio} ${styles.label}`}
                                    htmlFor={`${i}-${i1}`}
                                >
                                    {v1.text}
                                </label>
                            </div>))}</span>
                        </div>))}</div>
                    ))}
                    <h2>{selectedText}</h2>
                    {!isLoading && (<Button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); ispractice ? getnewtheory() : getpractice() }} >{ispractice ? 'проверить тест' : 'Перейти к практике'}</Button>)}
                    {rightanswers != undefined && (<div><Button>Пройти тест заново</Button> <p>?/{practicetext.length}</p> <Button>Перейти к следующему уроку</Button></div>)}
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
                        {activeTab == "tab-1" ? storecourse.length > 0 ? storecourse[activecourse].modules.map((v: Module, i: number) => (
                            <div className={styles.roadmapitem} key={i}>
                                <div className={styles.leftpart}><p>{v.title}</p>
                                    <span>{v.lessons.map((v1: Lesson, i) => (<p key={i}>{v1.title}</p>))}</span>
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
