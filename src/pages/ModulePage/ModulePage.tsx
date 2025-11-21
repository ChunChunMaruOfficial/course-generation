import { useEffect, useMemo, useRef, useState } from "react";
import styles from './ModulePage.module.scss'
import { Card } from "@/trash/components/Card/Card";
import Header from "@/trash/components/Header/header";
// import DynamicTextRender from "../../components/DynamicTextRender/DynamicTextRender";
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
    const navigate = useNavigate();
    const storecourse = useSelector((state: any) => state.answer.course);
    const activecourse = useSelector((state: any) => state.answer.activecourse);
    const activemodule = useSelector((state: any) => state.answer.activemodule);
    const activelesson = useSelector((state: any) => state.answer.activelesson);
    const [selectedwords, setselectedwords] = useState<string[]>([])
    const [selectedText, setSelectedText] = useState('');
    const [practicetext, setpracticetext] = useState<any>([]);
    const cardRef = useRef<HTMLDivElement>(null)


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

    const tabsData = [
        {
            id: "tab-1", label: "RoadMap", content: selectedwords
        },
        {
            id: "tab-2", label: "Notes", content: []
        }
    ];


    const [showmenu, setShowMenu] = useState<boolean>(false);
    const [ispractice, setispractice] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const menuRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = useState("tab-1");

    async function GetCourse() {
        console.log('GENERATING LESSON');

        const response = await axios.post('http://localhost:3000/api/generateLesson',
            { topic: decodeURIComponent(searchParams.get('theme')!) },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        dispatch(setactivelessoncontent(JSON.parse(JSON.stringify(response.data.result).replace('json', '').replaceAll('`', '')).lesson_text))
    }

    useEffect(() => {

        !storecourse[activecourse].modules[activemodule].lessons[activelesson].content ? GetCourse() : console.log(storecourse[activecourse].modules[activemodule].lessons[activelesson].content);


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
        const response = await axios.post('http://localhost:3000/api/generatePractice',
            { topic: decodeURIComponent(searchParams.get('theme')!) },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data.result);

        setpracticetext(response.data.result.questions)

    }

    function getnewtheory() {
        dispatch(setactivelesson(activelesson + 1))
        navigate(`../theory?theme=${encodeURIComponent(storecourse[activecourse].modules[activemodule].lessons[activelesson].title)}`)
        setispractice(false)
        GetCourse()
    }

    const sidebarRef = useRef<HTMLDivElement>(null)
    const menubuttonRef = useRef<HTMLImageElement>(null)
    const [sidebarispened, setsidebarispened] = useState<boolean | null>(null);

    const [Answers, setAnswers] = useState<(number[] | undefined)[]>(
        Array.from({ length: practicetext.length }, () => [])
    );

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

                    {!ispractice ? (storecourse[activecourse] && storecourse[activecourse].modules[activemodule] && storecourse[activecourse].modules[activemodule].lessons[activelesson].content ? (<div className={styles.theory}>
                        {storecourse[activecourse].modules[activemodule].lessons[activelesson].content && parse(storecourse[activecourse].modules[activemodule].lessons[activelesson].content)}

                    </div>) : (<img src={loading} className={styles.loadgif} />)) : (practicetext ? (
                        <div className={styles.questionContainer}>{practicetext.map((v: any, i: number) => (<div><h1>{v.question}</h1>
                            <span>{v.options.map((v1: any, i1: number) => (<div>
                                <input
                                    type="checkbox"
                                    id={`${i}-${i1}`}
                                    checked={Answers[i]?.includes(i1) ?? false}
                                    onChange={() => {
                                        setAnswers(a => {
                                            const newAnswers = [...a];
                                            // Берем текущий массив отмеченных опций вопроса
                                            const current = newAnswers[i] ? [...newAnswers[i]] : [];
                                            const indexInCurrent = current.indexOf(i1);
                                            if (indexInCurrent === -1) {
                                                // Добавить выбранный
                                                current.push(i1);
                                            } else {
                                                // Убрать, если уже выбран
                                                current.splice(indexInCurrent, 1);
                                            }
                                            newAnswers[i] = current;
                                            return newAnswers;
                                        });
                                        console.log(Answers);

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
                    ) : (<img src={loading} className={styles.loadgif} />))}
                    <h2>{selectedText}</h2>
                    <Button onClick={() => ispractice ? getnewtheory() : getpractice()} >{ispractice ? 'перейти к следующему уроку' : 'Перейти к практике'}</Button>
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
                        {activeTab == "tab-1" ? storecourse.length > 0 ? storecourse[0].modules.map((v: Module, i: number) => (
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
