import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/Button/button";
import { Input } from "@/components/Input/Input";
import { Label } from "@/components/Label/Label";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import styles from "./CourseGenerator.module.css";

const CourseGenerator = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [answerQuestions, setAnswerQuestions] = useState(false);


  const handleGenerate = () => {
    // отправка данных на сервер
    if (topic.trim()) {
      navigate("/course");
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

          <Button onClick={handleGenerate} disabled={!topic.trim()} size="lg" className={styles.generateButton}>
            <Sparkles className={styles.icon} />
            Сгенерировать
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CourseGenerator;
