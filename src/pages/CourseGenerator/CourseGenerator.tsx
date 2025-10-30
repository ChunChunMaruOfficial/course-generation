import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/Button/button";
import { Input } from "@/components/Input/Input";
import { Label } from "@/components/Label/Label";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import styles from "./CourseGenerator.module.css";
import loadgif from '../../assets/loading.gif';
import { useDispatch } from 'react-redux';
import { setcourse } from '../../counter/answerSlice'

const CourseGenerator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answerQuestions, setAnswerQuestions] = useState(false);


  async function handleGenerate() {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic }) 
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Ответ от сервера:', JSON.parse(data.result)); ////////
      setIsLoading(false);
      dispatch(setcourse( JSON.parse(data.result.replace('`', ''))));
      navigate("/course");

    } catch (error) {
      console.error('Ошибка при запросе к серверу:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Что я могу помочь вам изучить?</h1>
            <p className={styles.subtitle}>Напишите тему ниже, чтобы получить готовый мини-курс</p>
          </div>

          <div className={styles.inputContainer}>
            <Label htmlFor="topic" className={styles.formLabel}>
              Что я могу помочь вам изучить?
            </Label>
            <Input id="topic" placeholder="Введите тему" value={topic} onChange={e => setTopic(e.target.value)} className={styles.formInput} />
          </div>

          <div className={styles.checkboxContainer}>
            <div className={styles.checkboxRow}>
              <Checkbox id="questions" checked={answerQuestions} onCheckedChange={checked => setAnswerQuestions(checked as boolean)} />
              <label htmlFor="questions" className={styles.checkboxLabel}>
                Ответить на вопросы для улучшения курса
              </label>
            </div>
          </div>
          {isLoading ? <img src={loadgif} alt="Loading..." className={styles.loadgif} /> : <Button onClick={handleGenerate} disabled={!topic.trim()} size="lg" className={styles.generateButton}>
            <Sparkles className={styles.icon} />
            Сгенерировать
          </Button>}
        </div>
      </div>
    </div>
  );
};
export default CourseGenerator;
