import styles from './style.module.css'
import { Link } from "react-router-dom";
import { Button } from "@/trash/components/Button/button";
import type { CourseData } from "../../../interfaces/CourseData";
import menu from '../../../assets/svg/menu.svg'
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setuser } from '@/slices/userSlice';
import { Bell } from "lucide-react";
import { setcourses } from '../../../slices/answerSlice'
import axios from 'axios';
import { setactivecourse } from '../../../slices/answerSlice';
import userimg from '../../../assets/svg/user.svg'
import stars from '../../../assets/svg/stars.svg'
import array from '../../../assets/array'
import getRandom from '@/methods/getRandom';
import type { RootState } from '@/store';
import isuserimg from '../../../assets/svg/isuser.svg'

export default function Header({isLoading, setisLoading, sidebarispened, sidebarRef, menubuttonRef, setsidebarispened }: {isLoading?: boolean, setisLoading?: React.Dispatch<React.SetStateAction<boolean>>, sidebarispened: boolean | null, sidebarRef: RefObject<HTMLDivElement | null>, menubuttonRef: RefObject<HTMLImageElement | null>, setsidebarispened: React.Dispatch<React.SetStateAction<boolean | null>> }) {
    const storecourses = useSelector<RootState, CourseData[]>((state) => state.answer.courses);
    const userid = useSelector((state: any) => state.user.id);
        const usermail = useSelector<RootState, string>((state) => state.user.mail);
            const date = useSelector<RootState, string>((state) => state.user.date);
            const tokens = useSelector<RootState, number>((state) => state.user.tokens);
    const [ispopup, setispopup] = useState<boolean>(false)
    const [mail, setmail] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [isloging, setisloging] = useState<boolean>(true)
    const popupRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch();


    async function entering() {
        let guestId = localStorage.getItem('guestId');
        let body:{mail: string, password: string, id: string} = {mail: mail, password: password, id: guestId!};      
        console.log(body);
        setisLoading != undefined && setisLoading(true)
        const response = await axios.post(`http://localhost:3000/${isloging ? 'login' : 'registration'}`, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setispopup(false)
        console.log(response.data);
        dispatch(setuser(response.data.user))
                        dispatch(setcourses(response.data.user.courses));
                dispatch(setactivecourse(response.data.user.courses[0].id))
        setisLoading != undefined && setisLoading(false)

    }

    useEffect(() => {
        if (!storecourses[0] || !storecourses[0].modules || !storecourses[0].modules.length) {
            setisLoading != undefined && setisLoading(true)
            let guestId = localStorage.getItem('guestId');
            async function getcourse() {
                const response = await axios.post(`http://localhost:3000/getGuestCourses`, { guestId: guestId }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data.result);
                dispatch(setcourses(response.data.result));
                dispatch(setactivecourse(response.data.result[0].id))
                setisLoading != undefined && setisLoading(false)

            }
            getcourse()
        }
    }, []);

    return (
        <>
            <div ref={sidebarRef} className={`${styles.sidebar} ${sidebarispened ? styles.sidebaropen : sidebarispened === false ? styles.sidebarclosed : ''}`}>
                <h2 className={styles.pageTitle}>Мои курсы</h2>
                {!isLoading && storecourses.map((v: CourseData, i: number) => (
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
                        <Button variant="ghost" size="icon" onClick={() => setispopup(true)}><img src={ userid == '' ? userimg : isuserimg} /></Button>
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

                       {userid == '' && ( <>
                        <h1>{isloging ? "Войти в аккаунт" : 'Регистрация'}</h1>
                        <span><p>📫</p>
                            <div className={styles.inputgroup}>
                                <input value={mail} onChange={e => setmail(e.target.value)} type="email" className={styles.inputfield} id="email" placeholder=' ' />
                                <label htmlFor="email" className={styles.inputlabel}>Введите ваш email</label>
                            </div>
                        </span>
                        <span><p>🔐</p>
                            <div className={styles.inputgroup}>
                                <input value={password} onChange={e => setpassword(e.target.value)} type="password" className={styles.inputfield} id="password" placeholder=' ' />
                                <label htmlFor="password" className={styles.inputlabel}>Введите пароль</label>
                            </div>
                        </span>
                        <Button onClick={() => entering()}>{!isloging ? 'создать учетную запись' : 'войти'}</Button>
                        <p onClick={() => setisloging(!isloging)}> {isloging ? 'создать учетную запись' : 'войти'} </p>
                        </>)}
{ userid != '' && (<div className={styles.userdata}>
    <h2>{array[getRandom(0,array.length)]}</h2>
    <div>
        <p>{userid}</p>
        <p><img src={stars} alt="" />{tokens}</p>
        <p>{usermail}</p>
        <p>{date}</p>
        <div>{storecourses.map(v => (<p onClick={() => {setactivecourse(v.id); setispopup( false)}}>{v.title}</p>))}</div>
        <Button>Выйти из учетной записи</Button>
        </div>
</div>)}
                    </div>
                </div>)}
        </>
    )
}