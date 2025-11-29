import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/trash/components/Button/button";
import { Label } from "@/trash/components/Label/Label";
import { Checkbox } from "@/trash/components/Checkbox/Checkbox";
import styles from "./CourseGenerator.module.scss";
import loadgif from '../../assets/loading.gif';
import { useDispatch } from 'react-redux';
import { addcourse, setactivecourse } from '../../slices/answerSlice'
import type { Question } from "../../interfaces/Question";
import axios from "axios"
import arrowdown from '../../assets/svg/arrowdown.svg'


const CourseGenerator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [topic, setTopic] = useState<string>("выучить js");
  const [offtop, setofftop] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answerQuestions, setAnswerQuestions] = useState<boolean>(false);
  const [Questions, setQuestions] = useState<Question[]>([]);
  const [Answers, setAnswers] = useState<(number[] | undefined)[]>([]);
  const [ismobile, setismobile] = useState<boolean>(false)
  const [exampleTexts, setexampleTexts] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [sorrymsg, setsorrymsg] = useState<string>('');
  const [showsorrymsg, setshowsorrymsg] = useState<boolean>(false);
  const TopicRef = useRef<HTMLInputElement>(null)
  const QuestionRefs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    async function start() {
      const response = await axios.get('https://course-generation-server-production.up.railway.app/getexample');
      console.log(response);
      
      setexampleTexts(response.data.result);
    }
    start()

     const handleResize = () => {
      setismobile(window.innerWidth <= 768 ? true : false)
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])


  async function handleGenerate() {

    ///////////////////////////////////// ПРОВЕРКА НА ОТВЕЧЕННЫЕ ВОПРОСЫ /////////////////////////////////////

    if (Questions.length > 0 && (Answers.some(v => v != undefined && v.length == 0) || Answers.includes(undefined))) {
      const idx = Answers.findIndex((v: any) => v == undefined || v.length < 1)
      const element = QuestionRefs.current[idx];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        setTimeout(() => {
          element.style.backgroundColor = 'transparent';
        }, 2000);
      }
      return 0;
    }

    setIsLoading(true);

    if (answerQuestions) {

      //////////////////////////////////// ГЕНЕРАЦИЯ ВОПРОСОВ /////////////////////////////////////

      const response = await axios.post('https://course-generation-server-production.up.railway.app/api/generateQuestions', {
        topic,
        answerQuestions
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });


      setAnswerQuestions(false);
      setQuestions(response.data.result.questions);
      setAnswers(Array.from({ length: Questions.length }, () => []))
      setIsLoading(false);


    } else {

      //////////////////////////////////// ГЕНЕРАЦИЯ КУРСА /////////////////////////////////////

      let beasnwrs: string[] = []

      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = self.crypto.randomUUID();
        localStorage.setItem('guestId', guestId);
      }

      const bodyObj: { topic: string, guestId: string, answers?: string[], notes?: string } = { topic, guestId };

      if (Answers.some(v => v != undefined && v.length > 0)) {
        beasnwrs = Questions.map((q, i) => `${q.question} - ${Answers[i]!.map(j => q.options[j]).join(', ')}`);
      }

      if (beasnwrs) {
        bodyObj.answers = beasnwrs;
      }

      bodyObj.notes = offtop

      const body = JSON.stringify(bodyObj);
      console.log(body);


      const url = `https://course-generation-server-production.up.railway.app/api/${activeIndex == 0 ? 'generateFastCourse' : 'generateDetailedCourse'}`;
      console.log(url);
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (typeof response.data.result == 'string' && response.data.result.includes('УПСС!')) {
        setshowsorrymsg(true)
        setsorrymsg(response.data.result)
      } else {
        navigate("/course");
        dispatch(addcourse(response.data.result));
        dispatch(setactivecourse(response.data.result.id))
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={styles.lefttop}>
              <h1 className={styles.title}>SelfSpark</h1>
              <Label htmlFor="topic" className={styles.formLabel}>
                Что я могу помочь вам изучить?
              </Label>
            </div>
            {!ismobile && (<div className={styles.tabs}>
              <button
                className={`${styles.tabButton} ${activeIndex === 0 ? styles.active : ""}`}
                onClick={() => setActiveIndex(0)}
              >
                Быстро
              </button>
              <button
                className={`${styles.tabButton} ${activeIndex === 1 ? styles.active : ""}`}
                onClick={() => setActiveIndex(1)}
              >
                Подробно
              </button>

              {/* Глайдер */}
              <span
                className={styles.glider}
                style={{
                  width: activeIndex ? '55%' : '50%',
                  transform: `translateX(${activeIndex ? 'calc(100% - 10px)' : '-5px'})`,

                }}
              ></span>
            </div>)}
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.inputgroup}>
              <input value={topic} ref={TopicRef} onChange={e => setTopic(e.target.value)} type="text" className={styles.inputfield} id="name" placeholder=' ' />
              <label htmlFor="name" className={styles.inputlabel}>Введите {Questions.length > 0 && 'другую'} тему</label>
            </div>
          </div>
          {ismobile && (<div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeIndex === 0 ? styles.active : ""}`}
              onClick={() => setActiveIndex(0)}
            >
              Быстро
            </button>
            <button
              className={`${styles.tabButton} ${activeIndex === 1 ? styles.active : ""}`}
              onClick={() => setActiveIndex(1)}
            >
              Подробно
            </button>

            {/* Глайдер */}
            <span
              className={styles.glider}
              style={{
                width: activeIndex ? '55%' : '50%',
                transform: `translateX(${activeIndex ? 'calc(100% - 10px)' : '-5px'})`,

              }}
            ></span>
          </div>)}
          <p className={styles.subtitle}>Пользователи часто интересуются: <span className={styles.exampleTexts}>{exampleTexts.map((v, i) => (<span key={i}>{v}</span>))}</span></p>

          {(Questions.length == 0 && <div className={styles.checkboxContainer}>
            <div className={styles.checkboxRow}>
              <Checkbox id="questions" checked={answerQuestions} onCheckedChange={checked => setAnswerQuestions(checked as boolean)} />
              <label htmlFor="questions" className={styles.checkboxLabel}>
                Ответить на вопросы для улучшения курса
              </label>
            </div>
          </div>
          )}

          {Questions.map((v, i) => (
            <div ref={el => { QuestionRefs.current[i] = el }} key={i} className={styles.questionContainer}>
              <h1 className={styles.title}>{v.id}. {v.question}</h1>
              <span>
                {v.options.map((v1, i1) => (
                  <>
                    <input
                      key={i1}
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
                      {v1}
                    </label>
                  </>
                ))}
              </span>

            </div>
          ))}

          {(Questions.length > 0 && <div style={{ marginBottom: 40 }} className={styles.inputContainer}>
            <div className={styles.inputgroup}>
              <input value={offtop} onChange={e => setofftop(e.target.value)} type="text" className={styles.inputfield + " " + styles.inputfield2} id="name" placeholder=' ' />
              <label htmlFor="name" className={styles.inputlabel + " " + styles.inputlabel2}>У вас есть примечания для курса?</label>
            </div>
          </div>)}

          {isLoading ? <img src={loadgif} alt="Loading..." className={styles.loadgif} /> : <Button onClick={handleGenerate} disabled={!topic.trim() || Questions.length < 0} size="lg" className={styles.generateButton}>
            <Sparkles className={styles.icon} />
            Сгенерировать {answerQuestions ? 'вопросы' : 'курс'}
          </Button>}
        </div>
        <div className={styles.sorrymsg + ' ' + (showsorrymsg ? styles.sorrymsgshow : styles.sorrymsghide)}><p>{sorrymsg}</p><span><img onClick={() => setshowsorrymsg(false)} src={arrowdown} alt="" /><Button onClick={() => { TopicRef.current!.focus(); setTopic(''); setshowsorrymsg(false) }}>Ввести другую тему</Button></span></div>
      </div>
    </div>
  );
};
export default CourseGenerator;
