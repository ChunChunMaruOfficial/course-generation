import styles from './style.module.css'
import { Link } from "react-router-dom";
import { Button } from "@/trash/components/Button/button";
import type { CourseData } from "../../../interfaces/CourseData";
import menu from '../../../assets/svg/menu.svg'
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from "lucide-react";
import { setcourse } from '../../../slices/answerSlice'
import axios from 'axios';


export default function Header({ sidebarispened, sidebarRef, menubuttonRef, setcourseId, setsidebarispened }: { sidebarispened: boolean | null, sidebarRef: RefObject<HTMLDivElement | null>, menubuttonRef: RefObject<HTMLImageElement | null>, setcourseId: React.Dispatch<React.SetStateAction<number>>, setsidebarispened: React.Dispatch<React.SetStateAction<boolean | null>> }) {
    const storecourse = useSelector((state: any) => state.answer.course);
    const [ispopup, setispopup] = useState<boolean>(false)
    const [email, setemail] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [isloging, setisloging] = useState<boolean>(true)
    const popupRef = useRef<HTMLDivElement>(null)

    async function entering() {
        const response = await axios.post('http://localhost:3000/login', { mail: email, password: password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        response.data ? console.log('все гуд') : console.log("(((9");
        
        
    }

    const dispatch = useDispatch();
    useEffect(() => {
        if (!storecourse[0] || !storecourse[0].modules || !storecourse[0].modules.length) {
            async function getcourse() {
                const response = await fetch('http://localhost:3000/course');
                const data = await response.json();
                dispatch(setcourse(data.result));
                console.log(data);
                
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
                        <Button variant="ghost" size="icon" onClick={() => setispopup(true)}>😇</Button>
                    </div>
                </div>
            </header>
            {ispopup && (
                <div onClick={(e) => {
                    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                        setispopup(false)
                    }
                }} className={styles.popupmenu}>
                    <div ref={popupRef} className={styles.popup}>
                        <h1>{isloging ? "Войти в аккаунт" : 'регистрация'}</h1>

                        <div className={styles.inputgroup}>
                            <input value={email} onChange={e => setemail(e.target.value)} type="email" className={styles.inputfield} id="email" placeholder=' ' />
                            <label htmlFor="email" className={styles.inputlabel}>Введите ваш email</label>
                        </div>

                        <div className={styles.inputgroup}>
                            <input value={password} onChange={e => setpassword(e.target.value)} type="password" className={styles.inputfield} id="password" placeholder=' ' />
                            <label htmlFor="password" className={styles.inputlabel}>Введите пароль</label>
                        </div>
                        <Button onClick={() => entering()}>Войти</Button>
                        <p onClick={() => setisloging(!isloging)}> {isloging ? 'создать учетную запись' : 'войти'} </p>
                    </div>
                </div>)}
        </>
    )
}