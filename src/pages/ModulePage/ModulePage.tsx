import { useEffect, useMemo, useRef, useState } from "react";
import styles from './ModulePage.module.scss'
import { Card } from "@/components/Card/Card";
import ka from '../../assets/pic/ka.jpg'
import lh from '../../assets/pic/lh.jpg'
import Header from "@/components/Header/header";
import DynamicTextRender from "../../components/DynamicTextRender/DynamicTextRender";
import { Button } from "@/components/Button/button";
import { useSelector } from "react-redux";
import type { Lesson } from "@/interfaces/Lesson";
import type { Module } from "@/interfaces/Module";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";




export default function ModulePage() {
    const [selectedwords, setselectedwords] = useState<string[]>([])
    const [selectedText, setSelectedText] = useState('');
    const cardRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate();
    const text = `Java — это хорошо [структурированный], {объектно-ориентированный язык}, который может показаться простым для начинающих. Вы можете справиться с ним довольно быстро, так как много различных процессов запускаются автоматически. В первое время не потребуется углубляться глубоко в «как там все работает». [Java] является кроссплатформенным языком. Это позволяет программисту создать приложение, которое можно развернуть на любом устройстве. Это [предпочтительный] язык для IoT(интернет вещей), отличный инструмент для создания enterprise приложений, мобильных приложений и т.д.
.`;
    const [contenttext, setcontenttext] = useState<string[]>([text, text])
    const storecourse = useSelector((state: any) => state.answer.course);

    const moduledata = useMemo(() => ({
        title: 'F1',
        parts: [
            { title: 'name of part', pic: ka, content: contenttext[0] },
            { title: 'name of part', pic: lh, content: contenttext[1] }
        ]
    }), [contenttext]);

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
    const [searchParams] = useSearchParams();
    const menuRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = useState("tab-1");

    useEffect(() => {
        const theme = decodeURIComponent(searchParams.get('theme')!)
        async function GetCourse() {
            const response = await axios.post('http://localhost:3000/api/generateLesson',
                { topic: theme },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(response.data.result);


        }


        GetCourse()





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

    const selectasimp = () => {
        moduledata.parts.forEach(part => {
            part.content = part.content.replace(selectedText, `[${selectedText}]`);
            console.log(part.content);

        });

        setcontenttext(partdata => {
            const nwpd = partdata.map(part => {
                return part.replace(selectedText, `[${selectedText}]`);
            });
            return nwpd;
        });



    }

    const sidebarRef = useRef<HTMLDivElement>(null)
    const menubuttonRef = useRef<HTMLImageElement>(null)
    const [sidebarispened, setsidebarispened] = useState<boolean | null>(null);
    const [courseId, setcourseId] = useState<number>(0);



    return (
        <div onClick={(e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && menubuttonRef.current && !menubuttonRef.current.contains(e.target as Node)) {
                setsidebarispened((prev) => (prev === true ? false : null));
            }
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setShowMenu(false)
            }
        }}>
            <Header sidebarispened={sidebarispened} sidebarRef={sidebarRef} menubuttonRef={menubuttonRef} setcourseId={setcourseId} setsidebarispened={setsidebarispened}></Header>
            <div className={styles.parent}>
                <Card ref={cardRef} className={styles.container}>
                    <h1>{moduledata.title}</h1>
                    {moduledata.parts.map((v, i) => (<div><h2>{v.title}</h2><span>
                        <img src="https://habrastorage.org/getpro/habr/post_images/f73/416/25c/f7341625caa1be576a7ae1aec7a8d55e.png" alt="" />
                        <DynamicTextRender text={contenttext[i]} setselectedwords={setselectedwords} />
                    </span></div>))}
                    <h2>{selectedText}</h2>
                    <Button>Перейти к практике</Button>
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
                <div style={{ opacity: showmenu ? '1' : '0' }} ref={menuRef} className={styles.minimenu}><button onClick={() => { selectasimp(); setShowMenu(false) }}>Выделить как важное</button> <button onClick={() => { Getexplanation(); !selectedwords.includes(selectedText) && setselectedwords(sw => [...sw, selectedText]); setShowMenu(false) }}>объяснить</button></div>
            </div>

        </div>
    );
}
