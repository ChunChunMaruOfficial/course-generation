import styles from './style.module.css'
import { Link } from "react-router-dom";
import { Button } from "@/trash/components/Button/button";
import type { CourseData } from "../../../interfaces/CourseData";
import menu from '../../../assets/svg/menu.svg'
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from "lucide-react";
import { setcourses } from '../../../slices/answerSlice'
import axios from 'axios';
import { setactivecourse } from '../../../slices/answerSlice';

export default function Header({setisLoading, sidebarispened, sidebarRef, menubuttonRef, setsidebarispened }: {setisLoading?: React.Dispatch<React.SetStateAction<boolean>>, sidebarispened: boolean | null, sidebarRef: RefObject<HTMLDivElement | null>, menubuttonRef: RefObject<HTMLImageElement | null>, setsidebarispened: React.Dispatch<React.SetStateAction<boolean | null>> }) {
    const storecourse = useSelector((state: any) => state.answer.courses);
    const [ispopup, setispopup] = useState<boolean>(false)
    const [email, setemail] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [isloging, setisloging] = useState<boolean>(true)
    const popupRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch();


    async function entering() {
        const response = await axios.post(`http://localhost:3000/${isloging ? 'login' : 'registration'}`, { email: email, password: password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return console.log(response.data.answer);

    }

    useEffect(() => {
        if (!storecourse[0] || !storecourse[0].modules || !storecourse[0].modules.length) {
            async function getcourse() {
                const response = await fetch('http://localhost:3000/course');
                const data = await response.json();
                console.log(data.result);
                dispatch(setcourses(data.result));
                dispatch(setactivecourse(data.result[0].id))
                setisLoading != undefined && setisLoading(false)

            }
            getcourse()
        }
    }, []);

    return (
        <>
            <div ref={sidebarRef} className={`${styles.sidebar} ${sidebarispened ? styles.sidebaropen : sidebarispened === false ? styles.sidebarclosed : ''}`}>
                <h2 className={styles.pageTitle}>Мои курсы</h2>
                {storecourse.map((v: CourseData, i: number) => (
                    <p key={i} onClick={() => { dispatch(setactivecourse(v.id)); setsidebarispened(false); }}>{v.title}</p>))}
            <Link to="/" ><Button className={styles.genereatenewcourse}>Сгенерировать новый курс</Button></Link>
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
                        <Button onClick={() =>  entering()}>{isloging ? 'создать учетную запись' : 'войти'}</Button>
                        <p onClick={() => setisloging(!isloging)}> {isloging ? 'создать учетную запись' : 'войти'} </p>
                    </div>
                </div>)}
        </>
    )
}