import { useEffect, useRef, useState } from "react";
import styles from './ModulePage.module.css'
import { Card } from "@/components/Card/Card";
import ka from '../../assets/pic/ka.jpg'
import lh from '../../assets/pic/lh.jpg'


export default function ModulePage() {
    const [selectedwords, setselectedwords] = useState<string[]>([])
    const text = `Lorem ipsum dolor sit, amet consectetur {adipisicing elit}. Tempora ex in Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quod alias facilis iusto nemo dicta consequatur {animi} illum quaerat distinctio natus ad laborum, eaque harum sed aut culpa at temporibus. {Lorem ipsum} dolor sit amet consectetur adipisicing elit. Laudantium {enim itaque} porro est illum eos ad laborum {dolorem}, dolorum, repellat cumque quas nulla, unde quos repudiandae! Eum sapiente dolore nesciunt?`;

    const moduledata = {
        title: 'F1',
        parts: [
            {
                title: 'name of part',
                pic: ka,
                content: `Lorem ipsum dolor sit, amet consectetur {adipisicing elit}. Tempora ex in Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quod alias facilis iusto nemo dicta consequatur {animi} illum quaerat distinctio natus ad laborum, eaque harum sed aut culpa at temporibus. {Lorem ipsum} dolor sit amet consectetur adipisicing elit. Laudantium {enim itaque} porro est illum eos ad laborum {dolorem}, dolorum, repellat cumque quas nulla, unde quos repudiandae! Eum sapiente dolore nesciunt?`
            },
            {
                title: 'name of part',
                pic: ka,
                content: `Lorem ipsum dolor sit, amet consectetur {adipisicing elit}. Tempora ex in Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quod alias facilis iusto nemo dicta consequatur {animi} illum quaerat distinctio natus ad laborum, eaque harum sed aut culpa at temporibus. {Lorem ipsum} dolor sit amet consectetur adipisicing elit. Laudantium {enim itaque} porro est illum eos ad laborum {dolorem}, dolorum, repellat cumque quas nulla, unde quos repudiandae! Eum sapiente dolore nesciunt?`
            }
        ]
    }


    const tabsData = [
        {
            id: "tab-1", label: "RoadMap", content: selectedwords
        },
        {
            id: "tab-2", label: "Notes", content: []
        }
    ];

    const [selectedText, setSelectedText] = useState('');
    const [showmenu, setShowMenu] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = useState("tab-1");

    function formatText(text: string) {
        const parts = text.split(/({.*?})/g);
        return parts.map((part, i) =>
            part.startsWith('{') && part.endsWith('}') ? (
                <span key={i} onClick={() => !selectedwords.includes(part.slice(1, -1)) && setselectedwords(sw => [...sw, part.slice(1, -1)])} className={styles.highlight}>{part.slice(1, -1)}</span>
            ) : (
                part
            )
        );
    }

    useEffect(() => {
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
                    const menuWidth = menuRef.current.offsetWidth;
                    menuRef.current.style.left = `${event.clientX - menuWidth / 2}px`;
                    menuRef.current.style.top = `${event.clientY + 12}px`
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

    return (
        <div className={styles.parent}>
            <Card className={styles.container}>
                <h1>{moduledata.title}</h1>
                {moduledata.parts.map((v, i) => (<div><h2>{v.title}</h2><span><p>{ formatText(v.content)}</p><img src={v.pic} alt="" /></span></div>))}
                <h2>{selectedText}</h2>
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
                    {tabsData.map(({ id, content }) => (
                        <div key={id} className={`${styles.content__inner} ${activeTab === id ? styles.active : ""}`}>
                            <div className={styles.page}>
                                {content.map(v => (<p>{v}</p>))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ opacity: showmenu ? '1' : '0' }} ref={menuRef} className={styles.minimenu}><button>Выделить как важное</button> <button onClick={() => { !selectedwords.includes(selectedText) && setselectedwords(sw => [...sw, selectedText]); setShowMenu(false) }}>объяснить</button></div>




        </div>
    );
}
