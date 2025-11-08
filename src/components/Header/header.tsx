import styles from './style.module.css'
import { Link } from "react-router-dom";
import { Button } from "@/components/Button/button";
import type { CourseData } from "../../interfaces/CourseData";
import menu from '../../assets/svg/menu.svg'
import { useEffect, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from "lucide-react";
import { setcourse } from '../../counter/answerSlice'

export default function Header({ sidebarispened, sidebarRef, menubuttonRef, setcourseId, setsidebarispened }: { sidebarispened: boolean | null, sidebarRef: RefObject<HTMLDivElement | null>, menubuttonRef: RefObject<HTMLImageElement | null>, setcourseId: React.Dispatch<React.SetStateAction<number>>, setsidebarispened: React.Dispatch<React.SetStateAction<boolean | null>> }) {
    const storecourse = useSelector((state: any) => state.answer.course);

    const dispatch = useDispatch();
    useEffect(() => {

        if (!storecourse[0] || !storecourse[0].modules || !storecourse[0].modules.length) {
            async function getcourse() {
                const response = await fetch('http://localhost:3000/course');
                const data = await response.json();
                const items = typeof data.result === 'string'
                    ? data.result.split(/\n\s*\n/)
                    : data.result;

                const parsedCourses = items.map((item: string) => {
                    const cleaned = item.trim().replaceAll('```', '').replaceAll('json', '').replaceAll('\n', '');
                    return JSON.parse(cleaned);
                });

                dispatch(setcourse(parsedCourses));
            }

            getcourse()
        }
    }, []);

    return (
        <>
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
            </header></>
    )
}