import type { CourseData } from "@/interfaces/CourseData";
import { addselectedword } from "@/slices/answerSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/store";

export default async function Getexplanation(target: string) {
    const dispatch = useDispatch()
    const activecourse = useSelector<RootState, CourseData>((state) => state.answer.activecourse);
    const activemoduleid = useSelector<RootState, number>((state) => state.answer.activemoduleid);
    const activelessonid = useSelector<RootState, number>((state) => state.answer.activelessonid);

    const response = await axios.post('https://course-generation-server-production.up.railway.app/api/generateexplanation',
        { topic: target, moduleid: activemoduleid, courseid: activecourse.id, lessonid: activelessonid },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    dispatch(addselectedword(`${target} - ${response.data.result}`))
}