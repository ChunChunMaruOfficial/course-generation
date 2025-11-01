import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/Button/button";
import { Label } from "@/components/Label/Label";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import styles from "./CourseGenerator.module.css";
import loadgif from '../../assets/loading.gif';
import { useDispatch } from 'react-redux';
import { setcourse } from '../../counter/answerSlice'
import type { Question } from "../../interfaces/Question";

import exampleQuestions from '../../examples/Questions.json'
//
const CourseGenerator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [topic, setTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answerQuestions, setAnswerQuestions] = useState<boolean>(false);
  const [Questions, setQuestions] = useState<Question[]>([]);
  const [Answers, setAnswers] = useState<(number | undefined)[]>(Array(Questions.length).fill(undefined));
  const [exampleTexts, setexampleTexts] = useState<string[]>([])
  const QuestionRefs = useRef<(HTMLDivElement | null)[]>([])



  useEffect(() => {
    async function start() {
      const response = await fetch('http://localhost:3000/getexample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic, answerQuestions })
      });
      const data = await response.json();
      setexampleTexts(data.result)
    }
    start()
  }, [])


  async function handleGenerate() {

    if (Questions.length > 0 && Answers.includes(undefined)) {
      const idx = Answers.findIndex(v => v === undefined);
      console.log(idx);
      console.log(QuestionRefs);
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


    console.log(Questions.length);
    console.log(Answers);

    setIsLoading(true);
    if (answerQuestions) {
      try {
        const response = await fetch('http://localhost:3000/api/generateQuestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ topic, answerQuestions })
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Вопросы от сервера:', data.result); ////////
        setIsLoading(false);
        setAnswerQuestions(false)
        setQuestions(JSON.parse(data.result.trim()).questions)
        setAnswers(v => {
          const newAnswers = [...v];
          newAnswers.length = JSON.parse(data.result.trim()).questions.length;
          return newAnswers;
        });


      } catch (error) {
        console.error('Ошибка при запросе к серверу:', error);
        setIsLoading(false);
      }
    } else {
      try {
        let beasnwrs: string[] = []



        if (Answers.length > 0) {
          Questions.map((v, i) => beasnwrs.push(`${v.question} - ${v.options[Answers[i] ?? 9]}`))
        }

        const response = await fetch('http://localhost:3000/api/generateCourse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ topic, answers: beasnwrs })
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Ответ от сервера:', JSON.parse(data.result.trim())); ////////
        setIsLoading(false);
        dispatch(setcourse(JSON.parse(data.result.replace('`', '')))); //проверка на формат и блаблабла
        navigate("/course");

      } catch (error) {
        console.error('Ошибка при запросе к серверу:', error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>SelfSpark</h1>

          <div className={styles.inputContainer}>
            <Label htmlFor="topic" className={styles.formLabel}>
              Что я могу помочь вам изучить?
            </Label>
            <div className={styles.inputgroup}>
              <input value={topic} onChange={e => setTopic(e.target.value)} type="text" className={styles.inputfield} id="name" placeholder=' ' />
              <label htmlFor="name" className={styles.inputlabel}>Введите {Questions.length > 0 && 'другую'} тему</label>
            </div>
          </div>
          <p className={styles.subtitle}>Пользователи часто интересуются: <span className={styles.exampleTexts}>{exampleTexts.map((v, i) => (<p key={i}>{v}</p>))}</span></p>

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
                {v.options.map((v1, i1) => (<>
                  <input key={i1} name={v.id.toString()} checked={Answers[i] == i1} onChange={() => setAnswers(a => {
                    const newAnswers = [...a];
                    newAnswers[i] = i1;
                    console.log(Answers);
                    
                    return newAnswers;
                  })} type="radio" id={`${i}-${i1}`} /> <label className={styles.customradio + ' ' + styles.label} htmlFor={`${i}-${i1}`}>{v1}</label>
                </>))}
              </span>
            </div>
          ))}

          {isLoading ? <img src={loadgif} alt="Loading..." className={styles.loadgif} /> : <Button onClick={handleGenerate} disabled={!topic.trim() || Questions.length < 0} size="lg" className={styles.generateButton}>
            <Sparkles className={styles.icon} />
            Сгенерировать {answerQuestions ? 'вопросы' : 'курс'}
          </Button>}
        </div>
      </div>
    </div>
  );
};
export default CourseGenerator;
